import { IRetrieveFile } from '../../../Interfaces/Gateways';
import { AwsS3Template } from '../../Templates/AWS';
import { AwsS3TemplateConstructorParams } from './types';

type ExecuteInput = IRetrieveFile.Input;

export class RetrieveFile extends AwsS3Template {
  constructor({ s3Instance }: AwsS3TemplateConstructorParams) {
    super({ s3Instance });
  }

  protected async performAction({ key, bucketName, type }: ExecuteInput): Promise<ExecuteInput['type'] extends 'buffer' ? Buffer | undefined : ReadableStream | undefined> {
    const data = (await this.retrieveFromAws(key, bucketName)).Body;

    if (type === 'buffer') {
      return data === undefined ? undefined : Buffer.from(await data.transformToByteArray()) as any;
    }

    return data === undefined ? undefined : data.transformToWebStream();
  }

  private retrieveFromAws(key: string, bucketName: string) {
    return this.serviceInstance.getObject({
      Bucket: bucketName,
      Key: key,
    });
  }
}
