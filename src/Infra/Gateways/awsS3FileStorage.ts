import { S3 } from 'aws-sdk';
import { Readable } from 'stream';
import { FileStorageError } from '../../Errors';
import { awsErrorMapper } from '../../Utils/Gateways/Error';

import { IRetrieveFile, IUploadFile } from '../Interfaces/Gateways';

export class AwsS3FileStorage implements IRetrieveFile, IUploadFile {
  private readonly s3Instance: S3;

  constructor(accessKey: string, secret: string) {
    this.s3Instance = new S3({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret,
      },
    });
  }

  async retrieveFileFromStream({ key, bucketName }: IRetrieveFile.Input): Promise<Readable> {
    try {
      return this.retrieveFromAws(key, bucketName).createReadStream();
    } catch (err: any) {
      throw this.throwError(err);
    }
  }

  async retrieveFile({ key, bucketName }: IRetrieveFile.Input): Promise<Buffer> {
    try {
      return (await this.retrieveFromAws(key, bucketName).promise()).Body as Buffer;
    } catch (err: any) {
      throw this.throwError(err);
    }
  }

  async uploadFile({ bucketName, file, key }: IUploadFile.Input): Promise<string> {
    try {
      const { Location } = await this.s3Instance.upload({
        Bucket: bucketName,
        Key: key,
        Body: file,
      }).promise();

      return Location;
    } catch (err: any) {
      throw this.throwError(err);
    }
  }

  private retrieveFromAws(key: string, bucketName: string) {
    return this.s3Instance.getObject({
      Bucket: bucketName,
      Key: key,
    });
  }

  private throwError(err: any) {
    return new FileStorageError(err.message, awsErrorMapper(err.code, 's3'), 'aws', err.code);
  }
}
