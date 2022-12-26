import { httpErrorMapper, awsErrorMapper } from '../../../../src/Utils/Gateways/Error';
import { ERRORS, HTTP_ERROR_CODES, AWS_ERROR_CODES } from '../../../../src/Utils/Enums';

describe('gateways mappers', () => {
  describe('httpErrorMapper', () => {
    it('should return "E01001 when 404 is passed', () => {
      expect(httpErrorMapper(HTTP_ERROR_CODES.NOT_FOUND)).toBe(ERRORS.HTTP.NOT_FOUND);
    });

    it('should return "E01002 when 401 is passed', () => {
      expect(httpErrorMapper(HTTP_ERROR_CODES.UNAUTHORIZED)).toBe(ERRORS.HTTP.UNAUTHORIZED);
    });

    it('should return "E01003 when 403 is passed', () => {
      expect(httpErrorMapper(HTTP_ERROR_CODES.FORBIDDEN)).toBe(ERRORS.HTTP.FORBIDDEN);
    });

    it('should return "E01004 when 400 is passed', () => {
      expect(httpErrorMapper(HTTP_ERROR_CODES.BAD_REQUEST)).toBe(ERRORS.HTTP.BAD_REQUEST);
    });

    it('should return "E01005 when 500 is passed', () => {
      expect(httpErrorMapper(HTTP_ERROR_CODES.SERVER_ERROR)).toBe(ERRORS.HTTP.SERVER_ERROR);
    });

    it('should return "E01000 when 0 is passed', () => {
      expect(httpErrorMapper(0)).toBe(ERRORS.HTTP.UNKNOWN);
    });
  });

  describe('awsErrorMapper', () => {
    describe('s3', () => {
      it('should return "E03001" when "NoSuchKey" is passed', () => {
        expect(awsErrorMapper(AWS_ERROR_CODES.S3.NOT_FOUND, 's3')).toBe(ERRORS.FILE_STORAGE.NOT_FOUND);
      });

      it('should return "E03002" when "NoSuchBucket" is passed', () => {
        expect(awsErrorMapper(AWS_ERROR_CODES.S3.UNEXISTENT_BUCKET, 's3')).toBe(ERRORS.FILE_STORAGE.UNEXISTENT_BUCKET);
      });

      it('should return "E03003" when "InvalidAccessKeyId" is passed', () => {
        expect(awsErrorMapper(AWS_ERROR_CODES.S3.INVALID_ACCESS_KEY, 's3')).toBe(ERRORS.FILE_STORAGE.INVALID_ACCESS_KEY);
      });

      it('should return "E03004" when "SignatureDoesNotMatch" is passed', () => {
        expect(awsErrorMapper(AWS_ERROR_CODES.S3.INVALID_SECRET_KEY, 's3')).toBe(ERRORS.FILE_STORAGE.INVALID_SECRET_KEY);
      });

      it('should return "E03000" when 0 is passed', () => {
        expect(awsErrorMapper('0', 's3')).toBe(ERRORS.FILE_STORAGE.UNKNOWN);
      });
    });
  });

  describe('cognito', () => {
    it('should return "E03101" when "NotAuthorizedException" is passed', () => {
      expect(awsErrorMapper(AWS_ERROR_CODES.COGNITO.NOT_AUTHORIZED, 'cognito')).toBe(ERRORS.IDENTITY_PROVIDER.NOT_AUTHORIZED);
    });

    it('should return "E03102" when "ResourceNotFoundException" is passed', () => {
      expect(awsErrorMapper(AWS_ERROR_CODES.COGNITO.RESOURCE_NOT_FOUND, 'cognito')).toBe(ERRORS.IDENTITY_PROVIDER.RESOURCE_NOT_FOUND);
    });

    it('should return "E03103" when "UsernameExistsException" is passed', () => {
      expect(awsErrorMapper(AWS_ERROR_CODES.COGNITO.USERNAME_EXISTS, 'cognito')).toBe(ERRORS.IDENTITY_PROVIDER.USERNAME_EXISTS);
    });

    it('should return "E03104" when "InvalidParameterException" is passed', () => {
      expect(awsErrorMapper(AWS_ERROR_CODES.COGNITO.INVALID_PARAMETER, 'cognito')).toBe(ERRORS.IDENTITY_PROVIDER.INVALID_PARAMETER);
    });

    it('should return "E03105" when "InvalidPasswordException" is passed', () => {
      expect(awsErrorMapper(AWS_ERROR_CODES.COGNITO.INVALID_PASSWORD, 'cognito')).toBe(ERRORS.IDENTITY_PROVIDER.INVALID_PASSWORD);
    });

    it('should return "E03100" when 0 is passed', () => {
      expect(awsErrorMapper('0', 'cognito')).toBe(ERRORS.IDENTITY_PROVIDER.UNKNOWN);
    });
  });

  it('should return "E00000" when 0 is passed', () => {
    expect(awsErrorMapper('0')).toBe(ERRORS.UNKNOWN);
  });
});
