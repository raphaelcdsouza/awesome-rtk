import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { mock, MockProxy } from 'jest-mock-extended';

import { ChangePassword } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IChangePassword } from '../../../../../src';

jest.mock('aws-sdk');

type ExecuteInput = IChangePassword.Input;

describe('associateSoftwareToken', () => {
  let changePasswordPromiseSpy: jest.Mock;
  let cognitoInterfaceMock: MockProxy<CognitoIdentityServiceProvider>;
  let sut: ChangePassword;

  const clientId = 'any_client_id';

  const accessToken = 'any_access_token';
  const newPassword = 'any_new_password';
  const oldPassword = 'any_old_password';

  beforeAll(() => {
    changePasswordPromiseSpy = jest.fn().mockResolvedValue({});
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.changePassword.mockImplementation(jest.fn().mockImplementation(() => ({
      promise: changePasswordPromiseSpy,
    })));
  });

  beforeEach(() => {
    sut = new ChangePassword({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const changePasswordObject = {
    AccessToken: accessToken,
    PreviousPassword: oldPassword,
    ProposedPassword: newPassword,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "changePassword" with correct params', async () => {
    await sut.execute<ExecuteInput>({ accessToken, newPassword, oldPassword });

    expect(cognitoInterfaceMock.changePassword).toHaveBeenCalledWith(changePasswordObject);
    expect(cognitoInterfaceMock.changePassword).toHaveBeenCalledTimes(1);
  });

  it('should call "promise" with correct params', async () => {
    await sut.execute<ExecuteInput>({ accessToken, newPassword, oldPassword });

    expect(changePasswordPromiseSpy).toHaveBeenCalledWith();
    expect(changePasswordPromiseSpy).toHaveBeenCalledTimes(1);
  });

  it('should return undefined', async () => {
    const result = await sut.execute<ExecuteInput>({ accessToken, newPassword, oldPassword });

    expect(result).toBeUndefined();
  });
});
