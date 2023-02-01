/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IRespondToAuthChallenge } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = Omit<IRespondToAuthChallenge.Input, 'username'>;
type ExecuteOutput = IRespondToAuthChallenge.Output;

export class RespondToAuthChallenge extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance, clientSecret }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance, clientSecret });
  }

  protected async performAction({ name, session, responses: { mfaCode } }: ExecuteInput, username: string, secretHash?: string): Promise<ExecuteOutput> {
    const result = await this.serviceInstance.respondToAuthChallenge({
      ChallengeName: name,
      ClientId: this.clientId,
      Session: session,
      ChallengeResponses: {
        USERNAME: username,
        SOFTWARE_TOKEN_MFA_CODE: mfaCode,
        SECRET_HASH: secretHash!,
      },
    }).promise();

    return {
      authenticationData: {
        tokenType: result.AuthenticationResult!.TokenType!,
        accessToken: result.AuthenticationResult!.AccessToken!,
        refreshToken: result.AuthenticationResult!.RefreshToken!,
        idToken: result.AuthenticationResult!.IdToken!,
      },
    };
  }
}
