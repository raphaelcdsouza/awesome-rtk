import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { SignUpRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';

import { AwsCognitoTemplate } from '../../Templates/AWS';
import { ISignUp } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = Omit<ISignUp.Input, 'username'>;
type ExecuteOutput = ISignUp.Output;

export class SignUp extends AwsCognitoTemplate<CognitoIdentityServiceProvider> {
  constructor({ clientId, cognitoInstance, clientSecret }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance, clientSecret });
  }

  protected async performAction({ password, attributes }: ExecuteInput, username: string, secretHash?: string): Promise<ExecuteOutput> {
    const signUpRequestObject: SignUpRequest = {
      ClientId: this.clientId,
      Username: username,
      Password: password,
      SecretHash: secretHash,
    };

    if (attributes !== undefined && attributes.length > 0) {
      signUpRequestObject.UserAttributes = attributes;
    }

    const { UserSub } = await this.serviceInstance.signUp(signUpRequestObject).promise();

    return {
      id: UserSub,
    };
  }
}
