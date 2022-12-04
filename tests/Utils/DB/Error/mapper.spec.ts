import { postgresErrorMapper, mysqlErrorMapper } from '../../../../src/Utils/DB/Error';
import { ERRORS, POSTGRES_ERROR_CODES, MYSQL_ERROR_CODES } from '../../../../src/Utils/Enums';

describe('mapper', () => {
  describe('postgresErrorMapper', () => {
    it('should return "E02001" when "42P01" is passed', () => {
      expect(postgresErrorMapper(POSTGRES_ERROR_CODES.TABLE_NOT_FOUND)).toBe(ERRORS.DATABASE.TABLE_NOT_FOUND);
    });

    it('should return "E02002" when "42703" is passed', () => {
      expect(postgresErrorMapper(POSTGRES_ERROR_CODES.COLUMN_NOT_FOUND)).toBe(ERRORS.DATABASE.COLUMN_NOT_FOUND);
    });

    it('should return "E02000" when the error is unknown to the function', () => {
      expect(postgresErrorMapper('any_other_code')).toBe(ERRORS.DATABASE.UNKNOWN);
    });
  });

  describe('mysqlErrorMapper', () => {
    it('should return "E02002" when "1054" is passed', () => {
      expect(mysqlErrorMapper(MYSQL_ERROR_CODES.COLUMN_NOT_FOUND)).toBe(ERRORS.DATABASE.COLUMN_NOT_FOUND);
    });

    it('should return "E02000" when the error is unknown to the function', () => {
      expect(mysqlErrorMapper(999)).toBe(ERRORS.DATABASE.UNKNOWN);
    });
  });
});
