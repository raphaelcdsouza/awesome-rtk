import { InfraError } from '../../../../Errors';

export abstract class AwsServiceTemplate<T = unknown> {
  protected readonly serviceInstance: T;

  constructor(serviceInstance: T) {
    this.serviceInstance = serviceInstance;
  }

  protected abstract performAction(params: any): Promise<any>;

  protected abstract throwError(err: any): InfraError;

  async execute<Q = any, K = any>(params: Q): Promise<K> {
    try {
      return await this.performAction(params);
    } catch (err: any) {
      throw this.throwError(err);
    }
  }
}
