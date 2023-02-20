import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { mock, MockProxy } from 'jest-mock-extended';

import { UpdateUserAttributes } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IUpdateUserAttributes } from '../../../../../src';

jest.mock('aws-sdk');

type ExecuteInput = IUpdateUserAttributes.Input;
type ExecuteOutput = IUpdateUserAttributes.Output;

describe('associateSoftwareToken', () => {
  let updateUserAttributesPromiseSpy: jest.Mock;
  let cognitoInterfaceMock: MockProxy<CognitoIdentityServiceProvider>;
  let sut: UpdateUserAttributes;

  const clientId = 'any_client_id';

  const accessToken = 'any_access_token';
  const attributes = [
    { Name: 'any_attribute_1', Value: 'any_attribute_value_1' },
    { Name: 'any_attribute_2', Value: 'any_attribute_value_2' },
  ];

  beforeAll(() => {
    updateUserAttributesPromiseSpy = jest.fn().mockResolvedValue({});
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.updateUserAttributes.mockImplementation(jest.fn().mockImplementation(() => ({
      promise: updateUserAttributesPromiseSpy,
    })));
  });

  beforeEach(() => {
    sut = new UpdateUserAttributes({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const updateUserAttributesObject = {
    AccessToken: accessToken,
    UserAttributes: attributes,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "updateUserAttributes" with correct params', async () => {
    await sut.execute<ExecuteInput>({ accessToken, attributes });

    expect(cognitoInterfaceMock.updateUserAttributes).toHaveBeenCalledWith(updateUserAttributesObject);
    expect(cognitoInterfaceMock.updateUserAttributes).toHaveBeenCalledTimes(1);
  });

  it('should call "promise" with correct params', async () => {
    await sut.execute<ExecuteInput>({ accessToken, attributes });

    expect(updateUserAttributesPromiseSpy).toHaveBeenCalledWith();
    expect(updateUserAttributesPromiseSpy).toHaveBeenCalledTimes(1);
  });

  describe('updating user attributes that doesn\'t need verification', () => {
    it('should return undefined', async () => {
      const result = await sut.execute<ExecuteInput, ExecuteOutput>({ accessToken, attributes });

      expect(result).toBeUndefined();
    });
  });

  describe('updating user attributes that needs verification', () => {
    it('should return destination, delivery method and the name of the modified attribute', async () => {
      updateUserAttributesPromiseSpy.mockResolvedValueOnce({
        CodeDeliveryDetailsList: [
          {
            AttributeName: 'any_attribute',
            DeliveryMedium: 'any_delivery_method',
            Destination: 'any_destination',
          },
        ],
      });

      const result = await sut.execute<ExecuteInput, ExecuteOutput>({ accessToken, attributes });

      expect(result).toEqual([
        {
          destination: 'any_destination',
          deliveryMethod: 'any_delivery_method',
          attribute: 'any_attribute',
        },
      ]);
    });
  });
});
