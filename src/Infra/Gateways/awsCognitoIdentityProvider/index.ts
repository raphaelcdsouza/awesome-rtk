import { CognitoIdentityServiceProvider } from 'aws-sdk';

import { AwsCognitoTemplate } from '../Templates/AWS';
import * as Interfaces from '../../Interfaces/Gateways';
import * as Actions from './actions';

type AwsCognitoIdentityProviderConstructorParams = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  clientId: string;
  clientSecret?: string;
}

type AwsCognitoIdentityProviderActionConstructorParams = {
  clientId: string;
  cognitoInstance: CognitoIdentityServiceProvider;
  clientSecret?: string;
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
  Interfaces.IVerifyUserAttribute {
  private readonly cognitoInstance: CognitoIdentityServiceProvider;

  private readonly clientId: string;

  private readonly clientSecret?: string;

  constructor({
    region, accessKeyId, secretAccessKey, clientId, clientSecret,
  }: AwsCognitoIdentityProviderConstructorParams) {
    this.cognitoInstance = new CognitoIdentityServiceProvider({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async signUp({ username, password, attributes }: Interfaces.ISignUp.Input): Promise<Interfaces.ISignUp.Output> {
    const action = this.buildActionInstance(Actions.SignUp);
    return action.execute<Omit<Interfaces.ISignUp.Input, 'username'>, Interfaces.ISignUp.Output>({ password, attributes }, username);
  }

  async confirmSignUp({ username, code }: Interfaces.IConfirmSignUp.Input): Promise<void> {
    const action = this.buildActionInstance(Actions.ConfirmSignUp);
    await action.execute<Omit<Interfaces.IConfirmSignUp.Input, 'username'>, undefined>({ code }, username);
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

  private buildActionInstance<T extends AwsCognitoTemplate>(Action: new (params: AwsCognitoIdentityProviderActionConstructorParams) => T): T {
    return new Action({ clientId: this.clientId, cognitoInstance: this.cognitoInstance, clientSecret: this.clientSecret });
  }
}
