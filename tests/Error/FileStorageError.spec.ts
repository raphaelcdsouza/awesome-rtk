import { FileStorageError, InfraError } from '../../src/Errors';
import { ERRORS } from '../../src/Utils/Enums';

describe('BaseError', () => {
  const errorMessage = 'any_error_message';
  const errorCode = 'any_error_code';
  const provider = 'aws';
  const providerErrorCode = 'any_database_error_code';
  const unknownErrorMessage = 'Unknown error';

  let sut: FileStorageError;

  beforeEach(() => {
    sut = new FileStorageError(errorMessage, errorCode, provider, providerErrorCode);
  });

  it('should extends "InfraError" class', () => {
    expect(sut).toBeInstanceOf(InfraError);
  });

  it('should have the correct properties', () => {
    expect(sut).toHaveProperty('provider', provider);
    expect(sut).toHaveProperty('providerErrorCode', providerErrorCode);
  });

  it('should have "message" property as "Unknown error" if "code" argument is passed with value "E03000"', () => {
    const unknownError = new FileStorageError(errorMessage, ERRORS.FILE_STORAGE.UNKNOWN, provider, providerErrorCode);

    expect(unknownError).toHaveProperty('message', unknownErrorMessage);
  });
});
