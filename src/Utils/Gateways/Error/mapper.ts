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

export const awsErrorMapper = (code: string): string => {
  switch (code) {
    case AWS_ERROR_CODES.S3.NOT_FOUND:
      return ERRORS.AWS.S3.NOT_FOUND;
    case AWS_ERROR_CODES.S3.UNEXISTENT_BUCKET:
      return ERRORS.AWS.S3.UNEXISTENT_BUCKET;
    case AWS_ERROR_CODES.S3.INVALID_ACCESS_KEY:
      return ERRORS.AWS.S3.INVALID_ACCESS_KEY;
    case AWS_ERROR_CODES.S3.INVALID_SECRET_KEY:
      return ERRORS.AWS.S3.INVALID_SECRET_KEY;
    default:
      return ERRORS.AWS.UNKNOWN;
  }
};
