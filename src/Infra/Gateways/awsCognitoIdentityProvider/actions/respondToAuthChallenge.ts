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

  protected async performAction({ name, responses }: ExecuteInput, username: string, secretHash?: string): Promise<ExecuteOutput> {
    return {} as any;

    // if (result.AuthenticationResult !== undefined) {
    //   return {
    //     authenticationData: {
    //       tokenType: result.AuthenticationResult!.TokenType!,
    //       accessToken: result.AuthenticationResult!.AccessToken!,
    //       refreshToken: result.AuthenticationResult!.RefreshToken!,
    //       idToken: result.AuthenticationResult!.IdToken!,
    //     },
    //   };
    // }

    // return {
    //   challengeData: {
    //     challengeName: result.ChallengeName!,
    //     session: result.Session!,
    //     sub: result.ChallengeParameters!.USER_ID_FOR_SRP!,
    //   },
    // };
  }
}
