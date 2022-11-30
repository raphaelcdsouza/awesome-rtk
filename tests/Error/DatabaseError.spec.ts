import { DatabaseError, InfraError } from '../../src/Errors';
import { ERRORS } from '../../src/Utils/DB/Enums';

describe('BaseError', () => {
  const errorMessage = 'any_error_message';
  const errorCode = 'any_error_code';
  const databaseEngine = 'mysql';
  const databaseErrorCode = 'any_database_error_code';
  const unknownErrorMessage = 'Unknown error';

  let sut: DatabaseError;

  beforeEach(() => {
    sut = new DatabaseError(errorMessage, errorCode, databaseEngine, databaseErrorCode);
  });

  it('should extends "Error" class', () => {
    expect(sut).toBeInstanceOf(InfraError);
  });

  it('should have the correct properties', () => {
    expect(sut).toHaveProperty('engine', databaseEngine);
    expect(sut).toHaveProperty('engineErrorCode', databaseErrorCode);
  });

  it('should have "message" property as "Unknown error" if "code" argument is passed with value "E02000"', () => {
    const unknownError = new DatabaseError(errorMessage, ERRORS.DATABASE.UNKNOWN, databaseEngine, databaseErrorCode);

    expect(unknownError).toHaveProperty('message', unknownErrorMessage);
  });
});
