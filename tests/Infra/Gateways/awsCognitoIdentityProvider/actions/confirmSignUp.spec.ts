import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { mock, MockProxy } from 'jest-mock-extended';

import { ConfirmSignUp } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { IConfirmSignUp } from '../../../../../src/Infra/Interfaces/Gateways';

jest.mock('aws-sdk');

jest.mock('../../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_secret_hash'),
}));

type ExecuteInput = Omit<IConfirmSignUp.Input, 'username'>;

describe('awsCognitoIdentityProvider', () => {
  let confirmSignUpPromiseSpy: jest.Mock;
  let cognitoInterfaceMock: MockProxy<CognitoIdentityServiceProvider>;
  let sut: ConfirmSignUp;

  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  const username = 'any_user';

  beforeAll(() => {
    confirmSignUpPromiseSpy = jest.fn();
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.confirmSignUp.mockImplementation(jest.fn().mockImplementation(() => ({
      promise: confirmSignUpPromiseSpy,
    })));
  });

  beforeEach(() => {
    sut = new ConfirmSignUp({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const confirmationCode = 'any_confirmation_code';

  const confirmSignUpObject = {
    ClientId: clientId,
    Username: username,
    ConfirmationCode: confirmationCode,
  };

  it('should call "confirmSignUp" with correct params', async () => {
    await sut.execute<ExecuteInput>({ code: confirmationCode }, username);

    expect(cognitoInterfaceMock.confirmSignUp).toHaveBeenCalledWith(confirmSignUpObject);
    expect(cognitoInterfaceMock.confirmSignUp).toHaveBeenCalledTimes(1);
  });

  it('should call "promise" with correct params', async () => {
    await sut.execute<ExecuteInput>({ code: confirmationCode }, username);

    expect(confirmSignUpPromiseSpy).toHaveBeenCalledWith();
    expect(confirmSignUpPromiseSpy).toHaveBeenCalledTimes(1);
  });

  it('should return nothing', async () => {
    const result = await sut.execute<ExecuteInput>({ code: confirmationCode }, username);

    expect(result).toBeUndefined();
  });

  describe('with secret hash', () => {
    beforeEach(() => {
      sut = new ConfirmSignUp({ cognitoInstance: cognitoInterfaceMock, clientId, clientSecret });
    });

    it('should call "confirmSignUp" with correct params - secret hash -', async () => {
      await sut.execute<ExecuteInput>({ code: confirmationCode }, username);

      expect(cognitoInterfaceMock.confirmSignUp).toHaveBeenCalledWith({
        ...confirmSignUpObject,
        SecretHash: 'any_secret_hash',
      });
      expect(cognitoInterfaceMock.confirmSignUp).toHaveBeenCalledTimes(1);
    });
  });
});
