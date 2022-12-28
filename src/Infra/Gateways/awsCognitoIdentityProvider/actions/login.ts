/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CognitoIdentityServiceProvider } from 'aws-sdk';

import { AwsCognitoTemplate } from '../../Templates/AWS';
import { ILogin } from '../../../Interfaces/Gateways';

type LoginConstructorParams = {
  cognitoInstance: CognitoIdentityServiceProvider;
  clientId: string;
  clientSecret?: string;
}

type ExecuteInput = Omit<ILogin.Input, 'username'>;
type ExecuteOutput = ILogin.Output;

export class Login extends AwsCognitoTemplate<CognitoIdentityServiceProvider> {
  constructor({ clientId, cognitoInstance, clientSecret }: LoginConstructorParams) {
    super({ clientId, cognitoInstance, clientSecret });
  }

  protected async performAction(params: ExecuteInput, username: string, secretHash?: string): Promise<ExecuteOutput> {
    await this.serviceInstance.initiateAuth({
      ClientId: this.clientId,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: params.password,
        SECRET_HASH: secretHash!,
      },
    }).promise();
    return {} as any;
  }
}
