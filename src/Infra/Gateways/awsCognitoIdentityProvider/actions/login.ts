/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CognitoIdentityServiceProvider } from 'aws-sdk';

import { AwsCognitoTemplate } from '../../Templates/AWS';
import { ILogin } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = Omit<ILogin.Input, 'username'>;
type ExecuteOutput = ILogin.Output;

export class Login extends AwsCognitoTemplate<CognitoIdentityServiceProvider> {
  constructor({ clientId, cognitoInstance, clientSecret }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance, clientSecret });
  }

  protected async performAction({ password }: ExecuteInput, username: string, secretHash?: string): Promise<ExecuteOutput> {
    const result = await this.serviceInstance.initiateAuth({
      ClientId: this.clientId,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash!,
      },
    }).promise();

    if (result.AuthenticationResult !== undefined) {
      return {
        tokenType: result.AuthenticationResult!.TokenType!,
        accessToken: result.AuthenticationResult!.AccessToken!,
        refreshToken: result.AuthenticationResult!.RefreshToken!,
        idToken: result.AuthenticationResult!.IdToken!,
      };
    }

    return {
      challengeName: result.ChallengeName!,
      session: result.Session!,
      sub: result.ChallengeParameters!.USER_ID_FOR_SRP!,
    };
  }
}
