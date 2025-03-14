import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

import { IdentityProviderError, InfraError } from '../../../../Errors';
import { awsCognitoSecretHash } from '../../../../Utils';
import { awsErrorMapper } from '../../../../Utils/Gateways/Error/mapper';
import { AwsServiceTemplate } from './awsServiceTemplate';

type AwsCognitoIdentityProviderTemplateConstructorParams<T = any> = {
  cognitoInstance: T;
  clientId: string;
  clientSecret?: string;
  userPoolId?: string;
}

export abstract class AwsCognitoTemplate extends AwsServiceTemplate<CognitoIdentityProvider> {
  protected clientId: string;

  protected clientSecret?: string;

  protected userPoolId?: string;

  constructor({
    cognitoInstance, clientId, clientSecret, userPoolId,
  }: AwsCognitoIdentityProviderTemplateConstructorParams<CognitoIdentityProvider>) {
    super(cognitoInstance);
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.userPoolId = userPoolId;
  }

  protected abstract performAction(params: any, username?: string, secretHash?: string, userPoolId?: string): Promise<any>;

  override async execute<Q = any, K = any>(params: Q, username?: string): Promise<K> {
    try {
      let secretHash: string | undefined;

      if (this.clientSecret && username) {
        secretHash = this.createSecretHash(username, this.clientSecret);
      }

      return await this.performAction(params, username, secretHash, this.userPoolId);
    } catch (err: any) {
      throw this.throwError(err);
    }
  }

  protected throwError(err: any): InfraError {
    console.log('debug', err);
    return new IdentityProviderError(err.message, awsErrorMapper(err.Code, 'cognito'), 'aws', err.Code);
  }

  protected createSecretHash(username: string, clientSecret: string) {
    return awsCognitoSecretHash(username, this.clientId, clientSecret);
  }
}
