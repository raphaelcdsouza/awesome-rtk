import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { mock, MockProxy } from 'jest-mock-extended';

import { RespondToAuthChallenge } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IRespondToAuthChallenge } from '../../../../../src/Infra/Interfaces/Gateways';

jest.mock('aws-sdk');

jest.mock('../../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_secret_hash'),
}));

type ExecuteInput = Omit<IRespondToAuthChallenge.Input, 'username'>;
type ExecuteOutput = IRespondToAuthChallenge.Output;

describe('login', () => {
  let respondToAuthChallengePromiseSpy: jest.Mock;
  let cognitoInterfaceMock: MockProxy<CognitoIdentityServiceProvider>;
  let sut: RespondToAuthChallenge;

  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  const username = 'any_user';
  const challengeNameInput = 'any_challenge_name';
  const mfaCode = 'any_mfa_code';
  const session = 'any_session';

  const tokenType = 'any_token_type';
  const accessToken = 'any_access_token';
  const refreshToken = 'any_refresh_token';
  const idToken = 'any_id_token';

  beforeAll(() => {
    respondToAuthChallengePromiseSpy = jest.fn().mockResolvedValue({
      AuthenticationResult: {
        AccessToken: accessToken,
        RefreshToken: refreshToken,
        IdToken: idToken,
        ExpiresIn: 3600,
        TokenType: tokenType,
      },
    });
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.respondToAuthChallenge.mockImplementation(jest.fn().mockImplementation(() => ({
      promise: respondToAuthChallengePromiseSpy,
    })));
  });

  beforeEach(() => {
    sut = new RespondToAuthChallenge({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const respondToAuthObject = {
    ChallengeName: challengeNameInput,
    ClientId: clientId,
    ChallengeResponses: {
      USERNAME: username,
      SOFTWARE_TOKEN_MFA_CODE: mfaCode,
      SECRET_HASH: undefined as unknown as string,
    },
    Session: session,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "respondToAuthChallenge" with correct params', async () => {
    await sut.execute<ExecuteInput>({ name: challengeNameInput, responses: { mfaCode }, session }, username);

    expect(cognitoInterfaceMock.respondToAuthChallenge).toHaveBeenCalledWith(respondToAuthObject);
    expect(cognitoInterfaceMock.respondToAuthChallenge).toHaveBeenCalledTimes(1);
  });

  it('should call "promise" with correct params', async () => {
    await sut.execute<ExecuteInput>({ name: challengeNameInput, responses: { mfaCode }, session }, username);

    expect(respondToAuthChallengePromiseSpy).toHaveBeenCalledWith();
    expect(respondToAuthChallengePromiseSpy).toHaveBeenCalledTimes(1);
  });

  it('should return authentication data', async () => {
    const result = await sut.execute<ExecuteInput, ExecuteOutput>({ name: challengeNameInput, responses: { mfaCode }, session }, username);

    expect(result).toEqual({
      authenticationData: {
        tokenType,
        accessToken,
        refreshToken,
        idToken,
      },
    });
  });

  describe('with secret hash', () => {
    beforeEach(() => {
      sut = new RespondToAuthChallenge({ cognitoInstance: cognitoInterfaceMock, clientId, clientSecret });
    });

    it('should call "initiateAuth" with correct params', async () => {
      await sut.execute<ExecuteInput, ExecuteOutput>({ name: challengeNameInput, responses: { mfaCode }, session }, username);

      expect(cognitoInterfaceMock.respondToAuthChallenge).toHaveBeenCalledWith({
        ...respondToAuthObject,
        ChallengeResponses: {
          ...respondToAuthObject.ChallengeResponses,
          SECRET_HASH: 'any_secret_hash',
        },
      });
      expect(cognitoInterfaceMock.respondToAuthChallenge).toHaveBeenCalledTimes(1);
    });
  });
});
