import { HTTP_ERROR_CODES, ERRORS } from '../../Enums';

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
