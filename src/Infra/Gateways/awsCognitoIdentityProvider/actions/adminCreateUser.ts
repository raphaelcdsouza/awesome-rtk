import { AdminCreateUserCommandInput, DeliveryMediumType } from '@aws-sdk/client-cognito-identity-provider';
import { IAdminCreateUser } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplate } from '../../Templates/AWS';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = IAdminCreateUser.Input
type ExecuteOutput = IAdminCreateUser.Output

export class AdminCreateUser extends AwsCognitoTemplate {
  constructor({
    clientId, cognitoInstance, clientSecret, userPoolId,
  }: AwsCognitoTemplateConstructorParams) {
    super({
      clientId, cognitoInstance, clientSecret, userPoolId,
    });
  }

  protected async performAction({
    username, password, desiredDeliveryMediums, attributes,
  }: ExecuteInput, _?: string, __?: string, userPoolId?: string): Promise<ExecuteOutput> {
    const adminCreateUserRequestObject: AdminCreateUserCommandInput = {
      UserPoolId: userPoolId,
      Username: username,
      TemporaryPassword: password,
      DesiredDeliveryMediums: desiredDeliveryMediums as DeliveryMediumType[],
    };

    if (attributes !== undefined && attributes.length > 0) {
      adminCreateUserRequestObject.UserAttributes = attributes;
    }

    const { User } = await this.serviceInstance.adminCreateUser(adminCreateUserRequestObject);

    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const id = User!.Attributes!.find((attribute) => attribute.Name === 'sub')!.Value!;

    return {
      id,
    };
  }
}
