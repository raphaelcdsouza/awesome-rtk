import { InfraError, BaseError } from '../../src/Errors';

class InfraErrorStub extends InfraError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}

describe('InfraError', () => {
  const errorMessage = 'any_error_message';
  const errorCode = 'any_error_code';

  let sut: InfraError;

  beforeEach(() => {
    sut = new InfraErrorStub(errorMessage, errorCode);
  });

  it('should extends "Error" class', () => {
    expect(sut).toBeInstanceOf(BaseError);
  });
});
