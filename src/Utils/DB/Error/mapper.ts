import { POSTGRES_ERROR_CODES, MYSQL_ERROR_CODES, ERRORS } from '../../Enums';

export const postgresErrorMapper = (code: string): string => {
  switch (code) {
    case POSTGRES_ERROR_CODES.TABLE_NOT_FOUND:
      return ERRORS.DATABASE.TABLE_NOT_FOUND;
    case POSTGRES_ERROR_CODES.COLUMN_NOT_FOUND:
      return ERRORS.DATABASE.COLUMN_NOT_FOUND;
    default:
      return ERRORS.DATABASE.UNKNOWN;
  }
};

export const mysqlErrorMapper = (code: number): string => {
  switch (code) {
    case MYSQL_ERROR_CODES.COLUMN_NOT_FOUND:
      return ERRORS.DATABASE.COLUMN_NOT_FOUND;
    default:
      return ERRORS.DATABASE.UNKNOWN;
  }
};
