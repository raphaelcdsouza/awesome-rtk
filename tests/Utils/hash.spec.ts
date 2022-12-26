import { createHmac } from 'crypto';

import { awsCognitoSecretHash } from '../../src/Utils';

jest.mock('crypto');

describe('hash', () => {
  let updateSpy: jest.Mock;
  let digestSpy: jest.Mock;

  const username = 'any_user';
  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  beforeAll(() => {
    updateSpy = jest.fn();
    digestSpy = jest.fn().mockReturnValue('any_hashed');
    jest.mocked(createHmac).mockImplementation(jest.fn().mockImplementation(() => ({
      update: updateSpy,
      digest: digestSpy,
    })));
  });

  describe('awsCognitoSecretHash', () => {
    it('should call "createHmac" with correct params', () => {
      awsCognitoSecretHash(username, clientId, clientSecret);

      expect(createHmac).toHaveBeenCalledWith('sha256', clientSecret);
      expect(createHmac).toHaveBeenCalledTimes(1);
    });

    it('should call "update" with correct params', () => {
      awsCognitoSecretHash(username, clientId, clientSecret);

      expect(updateSpy).toHaveBeenCalledWith(`${username}${clientId}`);
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    it('should call "digest" with correct params', () => {
      awsCognitoSecretHash(username, clientId, clientSecret);

      expect(digestSpy).toHaveBeenCalledWith('base64');
      expect(digestSpy).toHaveBeenCalledTimes(1);
    });

    it('should return base64 hashed string', () => {
      const result = awsCognitoSecretHash(username, clientId, clientSecret);

      expect(result).toEqual('any_hashed');
    });
  });
});
