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

export class AwsCognitoIdentityProvider implements Interfaces.ISignUp, Interfaces.IConfirmSignUp {
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

  private buildActionInstance<T extends AwsCognitoTemplate>(Action: new (params: AwsCognitoIdentityProviderActionConstructorParams) => T): T {
    return new Action({ clientId: this.clientId, cognitoInstance: this.cognitoInstance, clientSecret: this.clientSecret });
  }
}
