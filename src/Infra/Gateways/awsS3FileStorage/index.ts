// import { S3 } from 'aws-sdk';
import { S3, S3ClientConfig } from '@aws-sdk/client-s3';

import { AwsS3Template } from '../Templates/AWS';
import * as Interfaces from '../../Interfaces/Gateways';
import * as Actions from './actions';

type AwsS3FileStorageConstructorParams = {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

type AwsS3ActionConstructorParams = {
  s3Instance: S3;
  region?: string;
}

export class AwsS3FileStorage
implements
  Interfaces.IRetrieveFile,
  Interfaces.IUploadFile {
  private readonly region?: string;

  private readonly s3Instance: S3;

  constructor({ region, accessKeyId, secretAccessKey }: AwsS3FileStorageConstructorParams) {
    let credentials: S3ClientConfig['credentials'];

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

  async retrieveFile({ key, bucketName, type = 'buffer' }: Interfaces.IRetrieveFile.Input): Promise<Interfaces.IRetrieveFile.Input['type'] extends 'buffer' ? Buffer : ReadableStream> {
    const action = this.buildActionInstance(Actions.RetrieveFile);
    return action.execute<Interfaces.IRetrieveFile.Input, Interfaces.IRetrieveFile.Input['type'] extends 'buffer' ? Buffer : ReadableStream>({ key, bucketName, type });
  }

  async uploadFile({
    bucketName, file, key, mimeType,
  }: Interfaces.IUploadFile.Input): Promise<string> {
    const action = this.buildActionInstance(Actions.UploadFile);
    return action.execute<Interfaces.IUploadFile.Input, string>({
      bucketName, file, key, mimeType,
    });
  }

  private buildActionInstance<T extends AwsS3Template>(Action: new (params: AwsS3ActionConstructorParams) => T): T {
    return new Action({ s3Instance: this.s3Instance, region: this.region });
  }
}
