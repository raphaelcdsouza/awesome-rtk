import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { mock, MockProxy } from 'jest-mock-extended';
import { IdentityProviderError } from '../../../../../src/Errors';

import { Login } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { ILogin } from '../../../../../src/Infra/Interfaces/Gateways';

jest.mock('aws-sdk');
jest.mock('../../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_secret_hash'),
}));

type ExecuteInput = Omit<ILogin.Input, 'username'>;
type ExecuteOutput = ILogin.Output;

describe('awsCognitoIdentityProvider', () => {
  let initiateAuthPromiseSpy: jest.Mock;
  let cognitoInterfaceMock: MockProxy<CognitoIdentityServiceProvider>;
  let sut: Login;

  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  const username = 'any_user';
  const password = 'any_password';

  const tokenType = 'any_token_type';
  const accessToken = 'any_access_token';
  const refreshToken = 'any_refresh_token';
  const idToken = 'any_id_token';

  beforeAll(() => {
    initiateAuthPromiseSpy = jest.fn().mockResolvedValue({
      AuthenticationResult: {
        AccessToken: accessToken,
        RefreshToken: refreshToken,
        IdToken: idToken,
        ExpiresIn: 3600,
        TokenType: tokenType,
      },
    });
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.initiateAuth.mockImplementation(jest.fn().mockImplementation(() => ({
      promise: initiateAuthPromiseSpy,
    })));
  });

  beforeEach(() => {
    sut = new Login({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const loginObject = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: undefined as unknown as string,
    },
  };

  it('should call "initiateAuth" with correct params', async () => {
    await sut.execute<ExecuteInput>({ password }, username);

    expect(cognitoInterfaceMock.initiateAuth).toHaveBeenCalledWith(loginObject);
    expect(cognitoInterfaceMock.initiateAuth).toHaveBeenCalledTimes(1);
  });

  it('should call "promise" with correct params', async () => {
    await sut.execute<ExecuteInput>({ password }, username);

    expect(initiateAuthPromiseSpy).toHaveBeenCalledWith();
    expect(initiateAuthPromiseSpy).toHaveBeenCalledTimes(1);
  });

  // it('should return destination and delivery medium', async () => {
  //   const result = await sut.resendSignUpConfirmationCode({ username });

  //   expect(result).toEqual({
  //     destination,
  //     deliveryMedium,
  //   });
  // });

  it('should throw a "IdentityProviderErrror" if "initiateAuth" throws', async () => {
    const errorMessage = 'any_error_message';
    const errorCode = 'any_error_code';
    const errorObject = {
      message: errorMessage,
      code: errorCode,
    };
    cognitoInterfaceMock.initiateAuth.mockImplementationOnce(() => { throw errorObject; });

    const promise = sut.execute<ExecuteInput>({ password }, username);

    await expect(promise).rejects.toBeInstanceOf(IdentityProviderError);
  });

  describe('with secret hash', () => {
    beforeEach(() => {
      sut = new Login({ cognitoInstance: cognitoInterfaceMock, clientId, clientSecret });
    });

    it('should call "initiateAuth" with correct params', async () => {
      await sut.execute<ExecuteInput>({ password }, username);

      expect(cognitoInterfaceMock.initiateAuth).toHaveBeenCalledWith({
        ...loginObject,
        AuthParameters: {
          ...loginObject.AuthParameters,
          SECRET_HASH: 'any_secret_hash',
        },
      });
      expect(cognitoInterfaceMock.initiateAuth).toHaveBeenCalledTimes(1);
    });
  });
});
