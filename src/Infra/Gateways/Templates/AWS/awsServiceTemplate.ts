import { InfraError } from '../../../../Errors';

export abstract class AwsServiceTemplate {
  protected readonly serviceInstance: any;

  constructor(serviceInstance: any) {
    this.serviceInstance = serviceInstance;
  }

  protected abstract performAction(serviceInstance: any, params: any): Promise<any>;

  protected abstract throwError(err: any): InfraError;

  async execute<Q = any, K = any>(params: Q): Promise<K> {
    try {
      return await this.performAction(this.serviceInstance, params);
    } catch (err: any) {
      throw this.throwError(err);
    }
  }
}
