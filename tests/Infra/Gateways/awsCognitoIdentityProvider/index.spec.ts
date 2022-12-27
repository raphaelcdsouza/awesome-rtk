import { CognitoIdentityServiceProvider } from 'aws-sdk';

import { AwsCognitoIdentityProvider } from '../../../../src/Infra/Gateways';
import { IdentityProviderError } from '../../../../src/Errors';
import { awsCognitoSecretHash } from '../../../../src/Utils';
import { awsErrorMapper } from '../../../../src/Utils/Gateways/Error';

jest.mock('aws-sdk');

jest.mock('../../../../src/Errors', () => ({
  IdentityProviderError: jest.fn(),
}));
jest.mock('../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_client_secret-hashed'),
}));
jest.mock('../../../../src/Utils/Gateways/Error/mapper', () => ({
  awsErrorMapper: jest.fn().mockReturnValue('any_error_mapped'),
}));

describe('awsCognitoIdentityProvider', () => {
  let signUpSpy: jest.Mock;
  let signUpPromiseSpy: jest.Mock;
  let confirmSignUpSpy: jest.Mock;
  let confirmSignUpPromiseSpy: jest.Mock;
  let resendConfirmationCodeSpy: jest.Mock;
  let resendConfirmationCodePromiseSpy: jest.Mock;
  let initiateAuthSpy: jest.Mock;
  let initiateAuthPromiseSpy: jest.Mock;

  let sut: AwsCognitoIdentityProvider;

  const region = 'any_region';
  const clientId = 'any_client_id';

  const username = 'any_user';
  const password = 'any_password';

  const sub = 'any_sub';
  const destination = 'any_destination';
  const deliveryMedium = 'any_delivery_medium';
  const tokenType = 'any_token_type';
  const accessToken = 'any_access_token';
  const refreshToken = 'any_refresh_token';
  const idToken = 'any_id_token';

  beforeAll(() => {
    signUpPromiseSpy = jest.fn().mockResolvedValue({
      UserConfirmed: false,
      CodeDeliveryDetails: {
        Destination: destination,
        DeliveryMedium: 'EMAIL',
        AttributeName: 'email',
      },
      UserSub: sub,
    });
    signUpSpy = jest.fn().mockReturnValue({
      promise: signUpPromiseSpy,
    });
    confirmSignUpPromiseSpy = jest.fn();
    confirmSignUpSpy = jest.fn().mockReturnValue({
      promise: confirmSignUpPromiseSpy,
    });
    resendConfirmationCodePromiseSpy = jest.fn().mockResolvedValue({
      CodeDeliveryDetails: {
        Destination: destination,
        DeliveryMedium: deliveryMedium,
        AttributeName: 'email',
      },
    });
    resendConfirmationCodeSpy = jest.fn().mockReturnValue({
      promise: resendConfirmationCodePromiseSpy,
    });
    initiateAuthPromiseSpy = jest.fn().mockResolvedValue({
      AuthenticationResult: {
        AccessToken: accessToken,
        RefreshToken: refreshToken,
        IdToken: idToken,
        ExpiresIn: 3600,
        TokenType: tokenType,
      },
    });
    initiateAuthSpy = jest.fn().mockReturnValue({
      promise: initiateAuthPromiseSpy,
    });
    jest.mocked(CognitoIdentityServiceProvider).mockImplementation(jest.fn().mockImplementation(() => ({
      signUp: signUpSpy,
      confirmSignUp: confirmSignUpSpy,
      resendConfirmationCode: resendConfirmationCodeSpy,
      initiateAuth: initiateAuthSpy,
    })));
  });

  beforeEach(() => {
    sut = new AwsCognitoIdentityProvider({ region, clientId });
  });

  it('should call "CognitoIdentityServiceProvider" with correct params', () => {
    expect(sut).toBeDefined();
    expect(CognitoIdentityServiceProvider).toHaveBeenCalledWith({
      region: 'any_region',
    });
    expect(CognitoIdentityServiceProvider).toHaveBeenCalledTimes(1);
  });

  describe('signUp', () => {
    const signUpObject = {
      ClientId: clientId,
      Username: username,
      Password: password,
    };

    it('should call "signUp" with correct params', async () => {
      await sut.signUp({ username, password });

      expect(signUpSpy).toHaveBeenCalledWith(signUpObject);
      expect(signUpSpy).toHaveBeenCalledTimes(1);
    });

    describe('with secret hash', () => {
      const clientSecret = 'any_client_secret';

      beforeEach(() => {
        sut = new AwsCognitoIdentityProvider({ region, clientId, clientSecret });
      });

      it('should call "signUp" with correct params - secret hash -', async () => {
        await sut.signUp({ username, password });

        expect(signUpSpy).toHaveBeenCalledWith({
          ...signUpObject,
          SecretHash: `${clientSecret}-hashed`,
        });
        expect(signUpSpy).toHaveBeenCalledTimes(1);
      });

      it('should call "awsCognitoSecretHash" with correct params', async () => {
        await sut.signUp({ username, password });

        expect(awsCognitoSecretHash).toHaveBeenCalledWith(username, clientId, clientSecret);
        expect(awsCognitoSecretHash).toHaveBeenCalledTimes(1);
      });
    });

    describe('with user attributes', () => {
      it('should call "signUp" with correct params - user attributes -', async () => {
        const attributes = [
          {
            Name: 'any_name',
            Value: 'any_value',
          },
        ];

        await sut.signUp({ username, password, attributes });

        expect(signUpSpy).toHaveBeenCalledWith({
          ...signUpObject,
          UserAttributes: attributes,
        });
        expect(signUpSpy).toHaveBeenCalledTimes(1);
      });

      it('should call "signUp" with correct params - user attributes length 0 -', async () => {
        await sut.signUp({ username, password, attributes: [] });

        expect(signUpSpy).toHaveBeenCalledWith(signUpObject);
        expect(signUpSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "promise" with correct params', async () => {
      await sut.signUp({ username, password });

      expect(signUpPromiseSpy).toHaveBeenCalledWith();
      expect(signUpPromiseSpy).toHaveBeenCalledTimes(1);
    });

    it('should return cognito user id', async () => {
      const result = await sut.signUp({ username, password });

      expect(result.id).toEqual(sub);
    });

    it('should throw a "IdentityProviderErrror" if "signUp" throws passing correct params to error constructor', async () => {
      const errorMessage = 'any_error_message';
      const errorCode = 'any_error_code';
      const errorObject = {
        message: errorMessage,
        code: errorCode,
      };
      signUpSpy.mockImplementationOnce(() => { throw errorObject; });

      const promise = sut.signUp({ username, password });

      await expect(promise).rejects.toBeInstanceOf(IdentityProviderError);
      expect(IdentityProviderError).toHaveBeenCalledTimes(1);
      expect(IdentityProviderError).toHaveBeenCalledWith(errorMessage, expect.any(String), 'aws', errorCode);
      expect(awsErrorMapper).toHaveBeenCalledTimes(1);
      expect(awsErrorMapper).toHaveBeenCalledWith(errorCode, 'cognito');
    });
  });

  describe('confirmSignUp', () => {
    const confirmationCode = 'any_confirmation_code';

    const confirmSignUpObject = {
      ClientId: clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
    };

    it('should call "confirmSignUp" with correct params', async () => {
      await sut.confirmSignUp({ username, code: confirmationCode });

      expect(confirmSignUpSpy).toHaveBeenCalledWith(confirmSignUpObject);
      expect(confirmSignUpSpy).toHaveBeenCalledTimes(1);
    });

    describe('with secret hash', () => {
      const clientSecret = 'any_client_secret';

      beforeEach(() => {
        sut = new AwsCognitoIdentityProvider({ region, clientId, clientSecret });
      });

      it('should call "confirmSignUp" with correct params - secret hash -', async () => {
        await sut.confirmSignUp({ username, code: confirmationCode });

        expect(confirmSignUpSpy).toHaveBeenCalledWith({
          ...confirmSignUpObject,
          SecretHash: `${clientSecret}-hashed`,
        });
        expect(confirmSignUpSpy).toHaveBeenCalledTimes(1);
      });

      it('should call "awsCognitoSecretHash" with correct params', async () => {
        await sut.confirmSignUp({ username, code: confirmationCode });

        expect(awsCognitoSecretHash).toHaveBeenCalledWith(username, clientId, clientSecret);
        expect(awsCognitoSecretHash).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "promise" with correct params', async () => {
      await sut.confirmSignUp({ username, code: confirmationCode });

      expect(confirmSignUpPromiseSpy).toHaveBeenCalledWith();
      expect(confirmSignUpPromiseSpy).toHaveBeenCalledTimes(1);
    });

    it('should return nothing', async () => {
      const result = await sut.confirmSignUp({ username, code: confirmationCode });

      expect(result).toBeUndefined();
    });

    it('should throw a "IdentityProviderErrror" if "confirmSignUp" throws passing correct params to error constructor', async () => {
      const errorMessage = 'any_error_message';
      const errorCode = 'any_error_code';
      const errorObject = {
        message: errorMessage,
        code: errorCode,
      };
      confirmSignUpSpy.mockImplementationOnce(() => { throw errorObject; });

      const promise = sut.confirmSignUp({ username, code: confirmationCode });

      await expect(promise).rejects.toBeInstanceOf(IdentityProviderError);
      expect(IdentityProviderError).toHaveBeenCalledTimes(1);
      expect(IdentityProviderError).toHaveBeenCalledWith(errorMessage, expect.any(String), 'aws', errorCode);
      expect(awsErrorMapper).toHaveBeenCalledTimes(1);
      expect(awsErrorMapper).toHaveBeenCalledWith(errorCode, 'cognito');
    });
  });

  describe('resendConfirmationCode', () => {
    const resendConfirmationCodeObject = {
      ClientId: clientId,
      Username: username,
    };

    it('should call "resendConfirmationCode" with correct params', async () => {
      await sut.resendSignUpConfirmationCode({ username });

      expect(resendConfirmationCodeSpy).toHaveBeenCalledWith(resendConfirmationCodeObject);
      expect(resendConfirmationCodeSpy).toHaveBeenCalledTimes(1);
    });

    describe('with secret hash', () => {
      const clientSecret = 'any_client_secret';

      beforeEach(() => {
        sut = new AwsCognitoIdentityProvider({ region, clientId, clientSecret });
      });

      it('should call "resendConfirmationCode" with correct params - secret hash -', async () => {
        await sut.resendSignUpConfirmationCode({ username });

        expect(resendConfirmationCodeSpy).toHaveBeenCalledWith({
          ...resendConfirmationCodeObject,
          SecretHash: `${clientSecret}-hashed`,
        });
        expect(resendConfirmationCodeSpy).toHaveBeenCalledTimes(1);
      });

      it('should call "awsCognitoSecretHash" with correct params', async () => {
        await sut.resendSignUpConfirmationCode({ username });

        expect(awsCognitoSecretHash).toHaveBeenCalledWith(username, clientId, clientSecret);
        expect(awsCognitoSecretHash).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "promise" with correct params', async () => {
      await sut.resendSignUpConfirmationCode({ username });

      expect(resendConfirmationCodePromiseSpy).toHaveBeenCalledWith();
      expect(resendConfirmationCodePromiseSpy).toHaveBeenCalledTimes(1);
    });

    it('should return destination and delivery medium', async () => {
      const result = await sut.resendSignUpConfirmationCode({ username });

      expect(result).toEqual({
        destination,
        deliveryMedium,
      });
    });

    it('should throw a "IdentityProviderErrror" if "resendConfirmationCode" throws passing correct params to error constructor', async () => {
      const errorMessage = 'any_error_message';
      const errorCode = 'any_error_code';
      const errorObject = {
        message: errorMessage,
        code: errorCode,
      };
      resendConfirmationCodeSpy.mockImplementationOnce(() => { throw errorObject; });

      const promise = sut.resendSignUpConfirmationCode({ username });

      await expect(promise).rejects.toBeInstanceOf(IdentityProviderError);
      expect(IdentityProviderError).toHaveBeenCalledTimes(1);
      expect(IdentityProviderError).toHaveBeenCalledWith(errorMessage, expect.any(String), 'aws', errorCode);
      expect(awsErrorMapper).toHaveBeenCalledTimes(1);
      expect(awsErrorMapper).toHaveBeenCalledWith(errorCode, 'cognito');
    });
  });

  describe('login', () => {
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
      await sut.login({ username, password });

      expect(initiateAuthSpy).toHaveBeenCalledWith(loginObject);
      expect(initiateAuthSpy).toHaveBeenCalledTimes(1);
    });

    describe('whith secret hash', () => {
      const clientSecret = 'any_client_secret';

      beforeEach(() => {
        sut = new AwsCognitoIdentityProvider({ region, clientId, clientSecret });
      });

      it('should call "initiateAuth" with correct params - secret hash -', async () => {
        loginObject.AuthParameters.SECRET_HASH = `${clientSecret}-hashed`;

        await sut.login({ username, password });

        expect(initiateAuthSpy).toHaveBeenCalledWith(loginObject);
        expect(initiateAuthSpy).toHaveBeenCalledTimes(1);
      });

      it('should call "awsCognitoSecretHash" with correct params', async () => {
        await sut.login({ username, password });

        expect(awsCognitoSecretHash).toHaveBeenCalledWith(username, clientId, clientSecret);
        expect(awsCognitoSecretHash).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "promise" with correct params', async () => {
      await sut.login({ username, password });

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

    // it('should throw a "IdentityProviderErrror" if "resendConfirmationCode" throws passing correct params to error constructor', async () => {
    //   const errorMessage = 'any_error_message';
    //   const errorCode = 'any_error_code';
    //   const errorObject = {
    //     message: errorMessage,
    //     code: errorCode,
    //   };
    //   resendConfirmationCodeSpy.mockImplementationOnce(() => { throw errorObject; });

    //   const promise = sut.resendSignUpConfirmationCode({ username });

    //   await expect(promise).rejects.toBeInstanceOf(IdentityProviderError);
    //   expect(IdentityProviderError).toHaveBeenCalledTimes(1);
    //   expect(IdentityProviderError).toHaveBeenCalledWith(errorMessage, expect.any(String), 'aws', errorCode);
    //   expect(awsErrorMapper).toHaveBeenCalledTimes(1);
    //   expect(awsErrorMapper).toHaveBeenCalledWith(errorCode, 'cognito');
    // });
  });
});
