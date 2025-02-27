import { IRetrieveFile } from '../../../Interfaces/Gateways';
import { AwsS3Template } from '../../Templates/AWS';
import { AwsS3TemplateConstructorParams } from './types';

type ExecuteInput = IRetrieveFile.Input;
type ExecuteOutput = IRetrieveFile.Output;

export class RetrieveFile extends AwsS3Template {
  constructor({ s3Instance }: AwsS3TemplateConstructorParams) {
    super({ s3Instance });
  }

  protected async performAction({ key, bucketName }: ExecuteInput): Promise<ExecuteOutput | undefined> {
    const { Body, ContentType } = await this.retrieveFromAws(key, bucketName);

    if (Body === undefined || ContentType === undefined) {
      return undefined;
    }

    return {
      data: Buffer.from(await Body.transformToByteArray()),
      contentType: ContentType,
    }
  }

  private retrieveFromAws(key: string, bucketName: string) {
    return this.serviceInstance.getObject({
      Bucket: bucketName,
      Key: key,
    });
  }
}
