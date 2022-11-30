import { BaseError } from '../../src/Errors';

class BaseErrorStub extends BaseError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}

describe('BaseError', () => {
  const errorMessage = 'any_error_message';
  const errorCode = 'any_error_code';

  let sut: BaseError;

  beforeEach(() => {
    sut = new BaseErrorStub(errorMessage, errorCode);
  });

  it('should extends "Error" class', () => {
    expect(sut).toBeInstanceOf(Error);
  });

  it('should have the correct properties', () => {
    expect(sut).toHaveProperty('message', errorMessage);
    expect(sut).toHaveProperty('code', errorCode);
  });
});
