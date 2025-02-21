import { IAdminDeleteUser } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplate } from '../../Templates/AWS';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = IAdminDeleteUser.Input

export class AdminDeleteUser extends AwsCognitoTemplate {
  constructor({
    clientId, cognitoInstance, clientSecret, userPoolId,
  }: AwsCognitoTemplateConstructorParams) {
    super({
      clientId, cognitoInstance, clientSecret, userPoolId,
    });
  }

  protected async performAction({ username }: ExecuteInput, _?: string, __?: string, userPoolId?: string): Promise<void> {
    await this.serviceInstance.adminDeleteUser({
      UserPoolId: userPoolId,
      Username: username,
    });
  }
}
