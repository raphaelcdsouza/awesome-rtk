import { CognitoIdentityServiceProvider } from 'aws-sdk';
import {
  SignUpRequest, ConfirmSignUpRequest, ResendConfirmationCodeRequest, InitiateAuthRequest,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';

import { IdentityProviderError } from '../../../Errors';
import { awsCognitoSecretHash } from '../../../Utils';
import { awsErrorMapper } from '../../../Utils/Gateways/Error';
import {
  ISignUp, IConfirmSignUp, IResendSignUpConfirmationCode, ILogin,
} from '../../Interfaces/Gateways';

type AwsCognitoIdentityProviderConstructorParams = {
  region: string;
  clientId: string;
  clientSecret?: string;
}

export class AwsCognitoIdentityProvider implements ISignUp, IConfirmSignUp, IResendSignUpConfirmationCode {
  private readonly cognitoInstance: CognitoIdentityServiceProvider;

  private readonly clientId: string;

  private readonly clientSecret?: string;

  constructor({ region, clientId, clientSecret }: AwsCognitoIdentityProviderConstructorParams) {
    this.cognitoInstance = new CognitoIdentityServiceProvider({
      region,
    });
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async signUp({ username, password, attributes }: ISignUp.Input): Promise<ISignUp.Output> {
    const signUpRequestObject: SignUpRequest = {
      ClientId: this.clientId,
      Username: username,
      Password: password,
    };

    if (this.clientSecret) {
      signUpRequestObject.SecretHash = this.createSecretHash(username);
    }

    if (attributes !== undefined && attributes.length > 0) {
      signUpRequestObject.UserAttributes = attributes;
    }

    try {
      const { UserSub } = await this.cognitoInstance.signUp(signUpRequestObject).promise();
      return {
        id: UserSub,
      };
    } catch (err: any) {
      throw this.throwError(err);
    }
  }

  async confirmSignUp({ username, code }: IConfirmSignUp.Input): Promise<void> {
    const confirmSignUpRequestObject: ConfirmSignUpRequest = {
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: code,
    };

    if (this.clientSecret) {
      confirmSignUpRequestObject.SecretHash = this.createSecretHash(username);
    }

    try {
      await this.cognitoInstance.confirmSignUp(confirmSignUpRequestObject).promise();
    } catch (err: any) {
      throw this.throwError(err);
    }
  }

  async resendSignUpConfirmationCode({ username }: IResendSignUpConfirmationCode.Input): Promise<IResendSignUpConfirmationCode.Output> {
    const resendConfirmationCodeRequestObject: ResendConfirmationCodeRequest = {
      ClientId: this.clientId,
      Username: username,
    };

    if (this.clientSecret) {
      resendConfirmationCodeRequestObject.SecretHash = this.createSecretHash(username);
    }

    try {
      const { CodeDeliveryDetails } = await this.cognitoInstance.resendConfirmationCode(resendConfirmationCodeRequestObject).promise();
      return {
        destination: CodeDeliveryDetails?.Destination,
        deliveryMedium: CodeDeliveryDetails?.DeliveryMedium,
      };
    } catch (err: any) {
      throw this.throwError(err);
    }
  }

  async login({ username, password }: ILogin.Input): Promise<ILogin.Output> {
    const initiateAuthRequestObject: InitiateAuthRequest = {
      ClientId: this.clientId,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    if (this.clientSecret) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      initiateAuthRequestObject.AuthParameters!.SECRET_HASH = this.createSecretHash(username);
    }

    await this.cognitoInstance.initiateAuth(initiateAuthRequestObject).promise();
    return {} as any;
  }

  private throwError(err: any) {
    return new IdentityProviderError(err.message, awsErrorMapper(err.code, 'cognito'), 'aws', err.code);
  }

  private createSecretHash(username: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return awsCognitoSecretHash(username, this.clientId, this.clientSecret!);
  }
}
