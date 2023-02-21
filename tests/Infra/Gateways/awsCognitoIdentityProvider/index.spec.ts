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

      it('should instantiate "SignUp" action with correct params - with "clientSecret"', async () => {
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
});
