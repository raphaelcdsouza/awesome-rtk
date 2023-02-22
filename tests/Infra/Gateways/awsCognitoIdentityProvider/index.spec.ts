import { CognitoIdentityServiceProvider } from 'aws-sdk';

import { AwsCognitoIdentityProvider } from '../../../../src';
import * as Actions from '../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';

jest.mock('aws-sdk');
jest.mock('../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions');

describe('awsCognitoIdentityProvider', () => {
  let sut: AwsCognitoIdentityProvider;

  const region = 'any_region';
  const accessKeyId = 'any_access_key_id';
  const secretAccessKey = 'any_secret_access_key';
  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  beforeEach(() => {
    sut = new AwsCognitoIdentityProvider({
      region, accessKeyId, secretAccessKey, clientId,
    });
  });

  it('should call "CognitoIdentityServiceProvider" with correct params', () => {
    expect(sut).toBeDefined();
    expect(CognitoIdentityServiceProvider).toHaveBeenCalledWith({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    expect(CognitoIdentityServiceProvider).toHaveBeenCalledTimes(1);
  });

  describe('signUp', () => {
    const username = 'any_username';
    const password = 'any_password';
    const attributes = [
      { Name: 'email', Value: 'any_email' },
      { Name: 'phone_number', Value: 'any_phone_number' },
    ];

    const signUpParamsObject = {
      password,
      attributes,
    };

    const returnedId = 'any_returned_id';
    const signUpReturnObject = {
      id: returnedId,
    };

    let signUpExecuteSpy: jest.Mock;

    beforeAll(() => {
      signUpExecuteSpy = jest.fn().mockResolvedValue(signUpReturnObject);
      jest.mocked(Actions.SignUp).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: signUpExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "SignUp" action with correct params - without "clientSecret"', async () => {
        await sut.signUp({ username, password, attributes });

        expect(Actions.SignUp).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityServiceProvider), clientSecret: undefined });
        expect(Actions.SignUp).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "SignUp" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.signUp({ username, password, attributes });

        expect(Actions.SignUp).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityServiceProvider), clientSecret });
        expect(Actions.SignUp).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.signUp({ username, password, attributes });

      expect(signUpExecuteSpy).toHaveBeenCalledWith(signUpParamsObject, username);
      expect(signUpExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should return correct data', async () => {
      const result = await sut.signUp({ username, password, attributes });

      expect(result).toEqual(signUpReturnObject);
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_signup_error');
      signUpExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.signUp({ username, password, attributes });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('confirmSignUp', () => {
    const username = 'any_username';
    const code = 'any_code';

    const confirmSignUpParamsObject = {
      code,
    };

    let confirmSignUpExecuteSpy: jest.Mock;

    beforeAll(() => {
      confirmSignUpExecuteSpy = jest.fn().mockResolvedValue(undefined);
      jest.mocked(Actions.ConfirmSignUp).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: confirmSignUpExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "ConfirmSignUp" action with correct params - without "clientSecret"', async () => {
        await sut.confirmSignUp({ username, code });

        expect(Actions.ConfirmSignUp).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityServiceProvider), clientSecret: undefined });
        expect(Actions.ConfirmSignUp).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "ConfirmSignUp" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.confirmSignUp({ username, code });

        expect(Actions.ConfirmSignUp).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityServiceProvider), clientSecret });
        expect(Actions.ConfirmSignUp).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.confirmSignUp({ username, code });

      expect(confirmSignUpExecuteSpy).toHaveBeenCalledWith(confirmSignUpParamsObject, username);
      expect(confirmSignUpExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should return undefined', async () => {
      const result = await sut.confirmSignUp({ username, code });

      expect(result).toBeUndefined();
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_confirmsignup_error');
      confirmSignUpExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.confirmSignUp({ username, code });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    const username = 'any_username';
    const password = 'any_password';

    const loginParamsObject = {
      password,
    };

    const tokenType = 'any_token_type';
    const accessToken = 'any_access_token';
    const refreshToken = 'any_refresh_token';
    const idToken = 'any_id_token';

    const loginReturnObjectWithAuthenticationData = {
      tokenType,
      accessToken,
      refreshToken,
      idToken,
    };

    const challengeName = 'any_challenge_name';
    const sub = 'any_sub';
    const session = 'any_session';

    const loginReturnObjectWithChallengeData = {
      challengeName,
      sub,
      session,
    };

    let loginExecuteSpy: jest.Mock;

    beforeAll(() => {
      loginExecuteSpy = jest.fn().mockResolvedValue(loginReturnObjectWithAuthenticationData);
      jest.mocked(Actions.Login).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: loginExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "Login" action with correct params - without "clientSecret"', async () => {
        await sut.login({ username, password });

        expect(Actions.Login).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityServiceProvider), clientSecret: undefined });
        expect(Actions.Login).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "Login" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.login({ username, password });

        expect(Actions.Login).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityServiceProvider), clientSecret });
        expect(Actions.Login).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.login({ username, password });

      expect(loginExecuteSpy).toHaveBeenCalledWith(loginParamsObject, username);
      expect(loginExecuteSpy).toHaveBeenCalledTimes(1);
    });

    describe('return data', () => {
      it('should return authentication data if "execute" returns "authenticationData"', async () => {
        const result = await sut.login({ username, password });

        expect(result).toEqual(loginReturnObjectWithAuthenticationData);
      });

      it('should return challenge data if "execute" returns "challengeData"', async () => {
        loginExecuteSpy.mockResolvedValueOnce(loginReturnObjectWithChallengeData);

        const result = await sut.login({ username, password });

        expect(result).toEqual(loginReturnObjectWithChallengeData);
      });
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_login_error');
      loginExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.login({ username, password });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('associateSoftwareToken', () => {
    const session = 'any_session';
    const accessToken = 'any_access_token';

    const associateSoftwareTokenParamsObject = {
      session,
      accessToken,
    };

    const publicKey = 'any_public_key';
    const returnedSession = 'any_returned_session';

    const associateSoftwareTokenReturnObject = {
      publicKey,
    };

    let associateSoftwareTokenExecuteSpy: jest.Mock;

    beforeAll(() => {
      associateSoftwareTokenExecuteSpy = jest.fn().mockResolvedValue(associateSoftwareTokenReturnObject);
      jest.mocked(Actions.AssociateSoftwareToken).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: associateSoftwareTokenExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "AssociateSoftwareToken" action with correct params - without "clientSecret"', async () => {
        await sut.associateSoftwareToken({ session, accessToken });

        expect(Actions.AssociateSoftwareToken).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityServiceProvider), clientSecret: undefined });
        expect(Actions.AssociateSoftwareToken).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "AssociateSoftwareToken" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.associateSoftwareToken({ session, accessToken });

        expect(Actions.AssociateSoftwareToken).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityServiceProvider), clientSecret });
        expect(Actions.AssociateSoftwareToken).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.associateSoftwareToken({ session, accessToken });

      expect(associateSoftwareTokenExecuteSpy).toHaveBeenCalledWith(associateSoftwareTokenParamsObject);
      expect(associateSoftwareTokenExecuteSpy).toHaveBeenCalledTimes(1);
    });

    describe('return data', () => {
      it('should return authentication data if "execute" returns "authenticationData"', async () => {
        const result = await sut.associateSoftwareToken({ session, accessToken });

        expect(result).toEqual(associateSoftwareTokenReturnObject);
      });

      it('should return challenge data if "execute" returns "challengeData"', async () => {
        associateSoftwareTokenExecuteSpy.mockResolvedValueOnce({ ...associateSoftwareTokenReturnObject, session: returnedSession });

        const result = await sut.associateSoftwareToken({ session, accessToken });

        expect(result).toEqual({ ...associateSoftwareTokenReturnObject, session: returnedSession });
      });
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_associateSoftwareToken_error');
      associateSoftwareTokenExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.associateSoftwareToken({ session, accessToken });

      await expect(promise).rejects.toThrow(error);
    });
  });
});
