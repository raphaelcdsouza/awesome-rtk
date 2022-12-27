import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { IdentityProviderError, InfraError } from '../../../../Errors';
import { awsCognitoSecretHash } from '../../../../Utils';
import { awsErrorMapper } from '../../../../Utils/Gateways/Error/mapper';
import { AwsServiceTemplate } from './awsServiceTemplate';

type AwsCognitoIdentityProviderConstructorParams = {
  cognitoInstance: CognitoIdentityServiceProvider;
  clientId: string;
  clientSecret?: string;
}

export abstract class AwsCognitoTemplate extends AwsServiceTemplate {
  private clientId: string;

  private clientSecret?: string;

  constructor({ cognitoInstance, clientId, clientSecret }: AwsCognitoIdentityProviderConstructorParams) {
    super(cognitoInstance);
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  protected abstract performAction(serviceInstance: CognitoIdentityServiceProvider, params: any, username?: string, secretHash?: string): Promise<any>;

  override async execute<Q = any, K = any>(params: Q, username?: string): Promise<K> {
    try {
      let secretHash: string | undefined;

      if (this.clientSecret && username) {
        secretHash = this.createSecretHash(username, this.clientSecret);
      }

      return await this.performAction(this.serviceInstance, params, username, secretHash);
    } catch (err: any) {
      throw this.throwError(err);
    }
  }

  protected throwError(err: any): InfraError {
    return new IdentityProviderError(err.message, awsErrorMapper(err.code, 'cognito'), 'aws', err.code);
  }

  protected createSecretHash(username: string, clientSecret: string) {
    return awsCognitoSecretHash(username, this.clientId, clientSecret);
  }
}
