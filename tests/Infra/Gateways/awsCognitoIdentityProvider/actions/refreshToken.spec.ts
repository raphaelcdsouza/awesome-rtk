import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { mock, MockProxy } from 'jest-mock-extended';

import { RefreshToken } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IRefreshToken } from '../../../../../src/Infra/Interfaces/Gateways';

jest.mock('aws-sdk');

jest.mock('../../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_secret_hash'),
}));

type ExecuteInput = Omit<IRefreshToken.Input, 'sub'>;
type ExecuteOutput = IRefreshToken.Output;

describe('login', () => {
  let initiateAuthPromiseSpy: jest.Mock;
  let cognitoInterfaceMock: MockProxy<CognitoIdentityServiceProvider>;
  let sut: RefreshToken;

  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  const refreshTokenInput = 'any_refresh_token_input';
  const sub = 'any_sub';

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
    sut = new RefreshToken({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const refreshTokenObject = {
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    ClientId: clientId,
    AuthParameters: {
      REFRESH_TOKEN: refreshTokenInput,
      SECRET_HASH: undefined as unknown as string,
    },
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "initiateAuth" with correct params', async () => {
    await sut.execute<ExecuteInput>({ refreshToken: refreshTokenInput }, sub);

    expect(cognitoInterfaceMock.initiateAuth).toHaveBeenCalledWith(refreshTokenObject);
    expect(cognitoInterfaceMock.initiateAuth).toHaveBeenCalledTimes(1);
  });

  it('should call "promise" with correct params', async () => {
    await sut.execute<ExecuteInput>({ refreshToken: refreshTokenInput }, sub);

    expect(initiateAuthPromiseSpy).toHaveBeenCalledWith();
    expect(initiateAuthPromiseSpy).toHaveBeenCalledTimes(1);
  });

  it('should return correct data in case of login without MFA', async () => {
    const result = await sut.execute<ExecuteInput, ExecuteOutput>({ refreshToken: refreshTokenInput }, sub);

    expect(result).toEqual({
      tokenType,
      accessToken,
      refreshToken,
      idToken,
    });
  });

  describe('with secret hash', () => {
    beforeEach(() => {
      sut = new RefreshToken({ cognitoInstance: cognitoInterfaceMock, clientId, clientSecret });
    });

    it('should call "initiateAuth" with correct params', async () => {
      await sut.execute<ExecuteInput>({ refreshToken: refreshTokenInput }, sub);

      expect(cognitoInterfaceMock.initiateAuth).toHaveBeenCalledWith({
        ...refreshTokenObject,
        AuthParameters: {
          ...refreshTokenObject.AuthParameters,
          SECRET_HASH: 'any_secret_hash',
        },
      });
      expect(cognitoInterfaceMock.initiateAuth).toHaveBeenCalledTimes(1);
    });
  });
});
