import { S3 } from '@aws-sdk/client-s3';

import { AwsServiceTemplate } from './awsServiceTemplate';
import { FileStorageError } from '../../../../Errors';
import { awsErrorMapper } from '../../../../Utils/Gateways/Error';

type AwsS3TemplateConstructorParams<T = any> = {
  s3Instance: T;
}

export abstract class AwsS3Template extends AwsServiceTemplate<S3> {
  constructor({ s3Instance }: AwsS3TemplateConstructorParams<S3>) {
    super(s3Instance);
  }

  protected abstract performAction(params: any): Promise<any>

  protected throwError(err: any): FileStorageError {
    return new FileStorageError(err.message, awsErrorMapper(err.code, 's3'), 'aws', err.code);
  }
}
