import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { mock, MockProxy } from 'jest-mock-extended';

import { AssociateSoftwareToken } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IAssociateSoftwareToken } from '../../../../../src/Infra/Interfaces/Gateways';

jest.mock('aws-sdk');

type ExecuteInput = IAssociateSoftwareToken.Input;
type ExecuteOutput = IAssociateSoftwareToken.Output;

describe('associateSoftwareToken', () => {
  let associateSoftwareTokenPromiseSpy: jest.Mock;
  let cognitoInterfaceMock: MockProxy<CognitoIdentityServiceProvider>;
  let sut: AssociateSoftwareToken;

  const clientId = 'any_client_id';

  const inputSession = 'any_input_session';
  const accessToken = 'any_access_token';

  const publicKey = 'any_public_key';
  const outputSession = 'any_output_session';

  beforeAll(() => {
    associateSoftwareTokenPromiseSpy = jest.fn().mockResolvedValue({
      SecretCode: publicKey,
      Session: outputSession,
    });
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.associateSoftwareToken.mockImplementation(jest.fn().mockImplementation(() => ({
      promise: associateSoftwareTokenPromiseSpy,
    })));
  });

  beforeEach(() => {
    sut = new AssociateSoftwareToken({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const associateSoftwareTokenObject = {
    Session: inputSession,
    AccessToken: undefined,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  describe('using session property after first login', () => {
    it('should call "associateSoftwareToken" with correct params', async () => {
      await sut.execute<ExecuteInput>({ session: inputSession });

      expect(cognitoInterfaceMock.associateSoftwareToken).toHaveBeenCalledWith(associateSoftwareTokenObject);
      expect(cognitoInterfaceMock.associateSoftwareToken).toHaveBeenCalledTimes(1);
    });

    it('should return session and secret code', async () => {
      const result = await sut.execute<ExecuteInput, ExecuteOutput>({ session: inputSession });

      expect(result).toEqual({
        publicKey,
        session: outputSession,
      });
    });
  });

  describe('using access token property when logged in', () => {
    const associateSoftwareTokenWithAccessTokenObject = {
      Session: undefined,
      AccessToken: accessToken,
    };

    it('should call "associateSoftwareToken" with correct params', async () => {
      await sut.execute<ExecuteInput>({ accessToken });

      expect(cognitoInterfaceMock.associateSoftwareToken).toHaveBeenCalledWith(associateSoftwareTokenWithAccessTokenObject);
      expect(cognitoInterfaceMock.associateSoftwareToken).toHaveBeenCalledTimes(1);
    });

    it('should return secret code', async () => {
      associateSoftwareTokenPromiseSpy.mockResolvedValueOnce({
        SecretCode: publicKey,
      });

      const result = await sut.execute<ExecuteInput, ExecuteOutput>({ accessToken });

      expect(result).toEqual({
        publicKey,
      });
    });
  });

  it('should call "promise" with correct params', async () => {
    await sut.execute<ExecuteInput>({ session: inputSession });

    expect(associateSoftwareTokenPromiseSpy).toHaveBeenCalledWith();
    expect(associateSoftwareTokenPromiseSpy).toHaveBeenCalledTimes(1);
  });
});
