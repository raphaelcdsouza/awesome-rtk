import { S3 } from 'aws-sdk';
import { Readable } from 'stream';
import { FileStorageError } from '../../Errors';
import { awsErrorMapper } from '../../Utils/Gateways/Error';

import { IRetrieveFile, IUploadFile } from '../Interfaces/Gateways';

type AwsS3FileStorageConstructorParams = {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export class AwsS3FileStorage implements IRetrieveFile, IUploadFile {
  private readonly region?: string;

  private readonly s3Instance: S3;

  constructor({ region, accessKeyId, secretAccessKey }: AwsS3FileStorageConstructorParams) {
    let credentials: S3.ClientConfiguration['credentials'];

    if (accessKeyId !== undefined && secretAccessKey !== undefined) {
      credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    this.region = region;

    this.s3Instance = new S3({
      credentials,
      region,
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

  async uploadFile({
    bucketName, file, key, mimeType,
  }: IUploadFile.Input): Promise<string> {
    try {
      const S3Params: S3.PutObjectRequest = {
        Bucket: bucketName,
        Key: key,
        Body: file,
      };

      if (mimeType !== undefined) {
        S3Params.ContentType = mimeType;
      }

      const { Location } = await this.s3Instance.upload(S3Params).promise();

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
