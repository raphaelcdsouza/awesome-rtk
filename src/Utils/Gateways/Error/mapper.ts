import { HTTP_ERROR_CODES, AWS_ERROR_CODES, ERRORS } from '../../Enums';

export const httpErrorMapper = (code?: number): string => {
  switch (code) {
    case HTTP_ERROR_CODES.BAD_REQUEST:
      return ERRORS.HTTP.BAD_REQUEST;
    case HTTP_ERROR_CODES.FORBIDDEN:
      return ERRORS.HTTP.FORBIDDEN;
    case HTTP_ERROR_CODES.NOT_FOUND:
      return ERRORS.HTTP.NOT_FOUND;
    case HTTP_ERROR_CODES.UNAUTHORIZED:
      return ERRORS.HTTP.UNAUTHORIZED;
    case HTTP_ERROR_CODES.SERVER_ERROR:
      return ERRORS.HTTP.SERVER_ERROR;
    default:
      return ERRORS.HTTP.UNKNOWN;
  }
};

export const awsErrorMapper = (code: string, service?: 's3' | 'cognito'): string => {
  if (service === 's3') {
    switch (code) {
      case AWS_ERROR_CODES.S3.NOT_FOUND:
        return ERRORS.FILE_STORAGE.NOT_FOUND;
      case AWS_ERROR_CODES.S3.UNEXISTENT_BUCKET:
        return ERRORS.FILE_STORAGE.UNEXISTENT_BUCKET;
      case AWS_ERROR_CODES.S3.INVALID_ACCESS_KEY:
        return ERRORS.FILE_STORAGE.INVALID_ACCESS_KEY;
      case AWS_ERROR_CODES.S3.INVALID_SECRET_KEY:
        return ERRORS.FILE_STORAGE.INVALID_SECRET_KEY;
      default:
        return ERRORS.FILE_STORAGE.UNKNOWN;
    }
  } else if (service === 'cognito') {
    switch (code) {
      case AWS_ERROR_CODES.COGNITO.NOT_AUTHORIZED:
        return ERRORS.IDENTITY_PROVIDER.NOT_AUTHORIZED;
      case AWS_ERROR_CODES.COGNITO.RESOURCE_NOT_FOUND:
        return ERRORS.IDENTITY_PROVIDER.RESOURCE_NOT_FOUND;
      case AWS_ERROR_CODES.COGNITO.USERNAME_EXISTS:
        return ERRORS.IDENTITY_PROVIDER.USERNAME_EXISTS;
      case AWS_ERROR_CODES.COGNITO.INVALID_PARAMETER:
        return ERRORS.IDENTITY_PROVIDER.INVALID_PARAMETER;
      case AWS_ERROR_CODES.COGNITO.INVALID_PASSWORD:
        return ERRORS.IDENTITY_PROVIDER.INVALID_PASSWORD;
      default:
        return ERRORS.IDENTITY_PROVIDER.UNKNOWN;
    }
  } else {
    return ERRORS.UNKNOWN;
  }
};
