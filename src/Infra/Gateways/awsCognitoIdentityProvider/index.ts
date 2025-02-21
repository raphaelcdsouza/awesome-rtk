import { CognitoIdentityProvider, CognitoIdentityProviderClientConfig } from '@aws-sdk/client-cognito-identity-provider';

import { AwsCognitoTemplate } from '../Templates/AWS';
import * as Interfaces from '../../Interfaces/Gateways';
import * as Actions from './actions';

type AwsCognitoIdentityProviderConstructorParams = {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  clientId: string;
  clientSecret?: string;
  userPoolId?: string;
}

type AwsCognitoIdentityProviderActionConstructorParams = {
  clientId: string;
  cognitoInstance: CognitoIdentityProvider;
  clientSecret?: string;
  userPoolId?: string;
}

export class AwsCognitoIdentityProvider
implements
  Interfaces.ISignUp,
  Interfaces.IConfirmSignUp,
  Interfaces.ILogin,
  Interfaces.IAssociateSoftwareToken,
  Interfaces.IVerifySoftwareToken,
  Interfaces.IRespondToAuthChallenge,
  Interfaces.IUpdateUserAttributes,
  Interfaces.IVerifyUserAttribute,
  Interfaces.IChangePassword,
  Interfaces.IForgotPassword,
  Interfaces.IConfirmForgotPassword,
  Interfaces.IToggleMFA,
  Interfaces.IDeleteUser,
  Interfaces.IGetUserAttributes,
  Interfaces.IAdminCreateUser,
  Interfaces.IAdminDeleteUser {
  private readonly cognitoInstance: CognitoIdentityProvider;

  private readonly clientId: string;

  private readonly clientSecret?: string;

  private readonly userPoolId?: string;

  constructor({
    region, accessKeyId, secretAccessKey, clientId, clientSecret, userPoolId,
  }: AwsCognitoIdentityProviderConstructorParams) {
    let credentials: CognitoIdentityProviderClientConfig['credentials'];

    if (accessKeyId !== undefined && secretAccessKey !== undefined) {
      credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    this.cognitoInstance = new CognitoIdentityProvider({
      region,
      credentials,
    });
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.userPoolId = userPoolId;
  }

  async signUp({ username, password, attributes }: Interfaces.ISignUp.Input): Promise<Interfaces.ISignUp.Output> {
    const action = this.buildActionInstance(Actions.SignUp);
    return action.execute<Omit<Interfaces.ISignUp.Input, 'username'>, Interfaces.ISignUp.Output>({ password, attributes }, username);
  }

  async confirmSignUp({ username, code }: Interfaces.IConfirmSignUp.Input): Promise<void> {
    const action = this.buildActionInstance(Actions.ConfirmSignUp);
    await action.execute<Omit<Interfaces.IConfirmSignUp.Input, 'username'>, undefined>({ code }, username);
  }

  async resendSignUpConfirmationCode({ username }: Interfaces.IResendSignUpConfirmationCode.Input): Promise<Interfaces.IResendSignUpConfirmationCode.Output> {
    const action = this.buildActionInstance(Actions.ResendSignUpConfirmationCode);
    return action.execute<Omit<Interfaces.IResendSignUpConfirmationCode.Input, 'username'>, Interfaces.IResendSignUpConfirmationCode.Output>({}, username);
  }

  async login({ username, password }: Interfaces.ILogin.Input): Promise<Interfaces.ILogin.Output> {
    const action = this.buildActionInstance(Actions.Login);
    return action.execute<Omit<Interfaces.ILogin.Input, 'username'>, Interfaces.ILogin.Output>({ password }, username);
  }

  async associateSoftwareToken({ session, accessToken }: Interfaces.IAssociateSoftwareToken.Input): Promise<Interfaces.IAssociateSoftwareToken.Output> {
    const action = this.buildActionInstance(Actions.AssociateSoftwareToken);
    return action.execute<Interfaces.IAssociateSoftwareToken.Input, Interfaces.IAssociateSoftwareToken.Output>({ session, accessToken });
  }

  async verifySoftwareToken({ session, accessToken, mfaCode }: Interfaces.IVerifySoftwareToken.Input): Promise<Interfaces.IVerifySoftwareToken.Output> {
    const action = this.buildActionInstance(Actions.VerifySoftwareToken);
    return action.execute<Interfaces.IVerifySoftwareToken.Input, Interfaces.IVerifySoftwareToken.Output>({ session, accessToken, mfaCode });
  }

  async respondToAuthChallenge({
    name, username, session, responses,
  }: Interfaces.IRespondToAuthChallenge.Input): Promise<Interfaces.IRespondToAuthChallenge.Output> {
    const action = this.buildActionInstance(Actions.RespondToAuthChallenge);
    return action.execute<Omit<Interfaces.IRespondToAuthChallenge.Input, 'username'>, Interfaces.IRespondToAuthChallenge.Output>({ name, session, responses }, username);
  }

  async updateUserAttributes({ accessToken, attributes }: Interfaces.IUpdateUserAttributes.Input): Promise<Interfaces.IUpdateUserAttributes.Output> {
    const action = this.buildActionInstance(Actions.UpdateUserAttributes);
    return action.execute<Interfaces.IUpdateUserAttributes.Input, Interfaces.IUpdateUserAttributes.Output>({ accessToken, attributes });
  }

  async verifyUserAttribute({ accessToken, attribute, code }: Interfaces.IVerifyUserAttribute.Input): Promise<void> {
    const action = this.buildActionInstance(Actions.VerifyUserAttribute);
    await action.execute<Interfaces.IVerifyUserAttribute.Input, undefined>({ accessToken, attribute, code });
  }

  async changePassword({ accessToken, oldPassword, newPassword }: Interfaces.IChangePassword.Input): Promise<void> {
    const action = this.buildActionInstance(Actions.ChangePassword);
    await action.execute<Interfaces.IChangePassword.Input, undefined>({ accessToken, oldPassword, newPassword });
  }

  async forgotPassword({ username }: Interfaces.IForgotPassword.Input): Promise<Interfaces.IForgotPassword.Output> {
    const action = this.buildActionInstance(Actions.ForgotPassword);
    return action.execute<Omit<Interfaces.IForgotPassword.Input, 'username'>, Interfaces.IForgotPassword.Output>({}, username);
  }

  async confirmForgotPassword({ username, newPassword, code }: Interfaces.IConfirmForgotPassword.Input): Promise<void> {
    const action = this.buildActionInstance(Actions.ConfirmForgotPassword);
    await action.execute<Omit<Interfaces.IConfirmForgotPassword.Input, 'username'>, undefined>({ newPassword, code }, username);
  }

  async toggleMFA({ accessToken, enabled, preferred }: Interfaces.IToggleMFA.Input): Promise<void> {
    const action = this.buildActionInstance(Actions.ToggleMFA);
    await action.execute<Interfaces.IToggleMFA.Input, undefined>({ accessToken, enabled, preferred });
  }

  async deleteUser({ accessToken }: Interfaces.IDeleteUser.Input): Promise<void> {
    const action = this.buildActionInstance(Actions.DeleteUser);
    await action.execute<Interfaces.IDeleteUser.Input, undefined>({ accessToken });
  }

  async getUserAttributes({ accessToken }: Interfaces.IGetUserAttributes.Input): Promise<Interfaces.IGetUserAttributes.Output> {
    const action = this.buildActionInstance(Actions.GetUserAttributes);
    return action.execute<Interfaces.IGetUserAttributes.Input, Interfaces.IGetUserAttributes.Output>({ accessToken });
  }

  async refreshToken({ refreshToken, sub }: Interfaces.IRefreshToken.Input): Promise<Interfaces.IRefreshToken.Output> {
    const action = this.buildActionInstance(Actions.RefreshToken);
    return action.execute<Omit<Interfaces.IRefreshToken.Input, 'sub'>, Interfaces.IRefreshToken.Output>({ refreshToken }, sub);
  }

  async adminCreateUser({ username, password, attributes, desiredDeliveryMediums }: Interfaces.IAdminCreateUser.Input): Promise<Interfaces.IAdminCreateUser.Output> {
    const action = this.buildActionInstance(Actions.AdminCreateUser);
    return action.execute<Interfaces.IAdminCreateUser.Input, Interfaces.IAdminCreateUser.Output>({ password, attributes, desiredDeliveryMediums, username });
  }

  async adminDeleteUser({ username }: Interfaces.IAdminDeleteUser.Input): Promise<void> {
    const action = this.buildActionInstance(Actions.AdminDeleteUser);
    await action.execute<Interfaces.IAdminDeleteUser.Input, undefined>({ username });
  }

  private buildActionInstance<T extends AwsCognitoTemplate>(Action: new (params: AwsCognitoIdentityProviderActionConstructorParams) => T): T {
    return new Action({ clientId: this.clientId, cognitoInstance: this.cognitoInstance, clientSecret: this.clientSecret, userPoolId: this.userPoolId });
  }
}
