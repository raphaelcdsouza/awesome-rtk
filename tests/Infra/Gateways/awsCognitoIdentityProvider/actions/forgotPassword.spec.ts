import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { mock, MockProxy } from 'jest-mock-extended';

import { ForgotPassword } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IForgotPassword } from '../../../../../src';

jest.mock('aws-sdk');

jest.mock('../../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_secret_hash'),
}));

type ExecuteInput = undefined;
type ExecuteOutput = IForgotPassword.Output;

describe('associateSoftwareToken', () => {
  let forgotPasswordPromiseSpy: jest.Mock;
  let cognitoInterfaceMock: MockProxy<CognitoIdentityServiceProvider>;
  let sut: ForgotPassword;

  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  const username = 'any_username';

  const destination = 'any_destination';
  const deliveryMethod = 'any_delivery_method';
  const attribute = 'any_attribute';

  beforeAll(() => {
    forgotPasswordPromiseSpy = jest.fn().mockResolvedValue({
      CodeDeliveryDetails: {
        Destination: destination,
        DeliveryMedium: deliveryMethod,
        AttributeName: attribute,
      },
    });
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.forgotPassword.mockImplementation(jest.fn().mockImplementation(() => ({
      promise: forgotPasswordPromiseSpy,
    })));
  });

  beforeEach(() => {
    sut = new ForgotPassword({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const forgotPasswordObject = {
    ClientId: clientId,
    Username: username,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "forgotPassword" with correct params', async () => {
    await sut.execute<ExecuteInput>(undefined, username);

    expect(cognitoInterfaceMock.forgotPassword).toHaveBeenCalledWith(forgotPasswordObject);
    expect(cognitoInterfaceMock.forgotPassword).toHaveBeenCalledTimes(1);
  });

  it('should call "promise" with correct params', async () => {
    await sut.execute<ExecuteInput>(undefined, username);

    expect(forgotPasswordPromiseSpy).toHaveBeenCalledWith();
    expect(forgotPasswordPromiseSpy).toHaveBeenCalledTimes(1);
  });

  it('should return correct data in case of login with MFA', async () => {
    const result = await sut.execute<ExecuteInput, ExecuteOutput>(undefined, username);

    expect(result).toEqual({
      destination,
      deliveryMethod,
      attribute,
    });
  });

  describe('with secret hash', () => {
    beforeEach(() => {
      sut = new ForgotPassword({ cognitoInstance: cognitoInterfaceMock, clientId, clientSecret });
    });

    it('should call "forgotPassword" with correct params', async () => {
      await sut.execute<ExecuteInput>(undefined, username);

      expect(cognitoInterfaceMock.forgotPassword).toHaveBeenCalledWith({
        ...forgotPasswordObject,
        SecretHash: 'any_secret_hash',
      });
      expect(cognitoInterfaceMock.forgotPassword).toHaveBeenCalledTimes(1);
    });
  });
});
