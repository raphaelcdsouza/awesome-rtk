import { HttpError, InfraError } from '../../src/Errors';
import { httpErrorMapper } from '../../src/Utils/Gateways/Error';

jest.mock('../../src/Utils/Gateways/Error/mapper', () => ({
  httpErrorMapper: jest.fn(),
}));

describe('HttpError', () => {
  const errorMessage = 'any_error_message';
  const errorCode = 400;

  let sut: HttpError;

  const mappedErrorCode = 'any_error_code';

  beforeAll(() => {
    jest.mocked(httpErrorMapper).mockImplementation(jest.fn().mockReturnValue(mappedErrorCode));
  });

  beforeEach(() => {
    sut = new HttpError(errorMessage, errorCode);
  });

  it('should extends "InfraError" class', () => {
    expect(sut).toBeInstanceOf(InfraError);
  });

  it('should call "httpErrorMapper" with correct parameters', () => {
    expect(httpErrorMapper).toHaveBeenCalledTimes(1);
    expect(httpErrorMapper).toHaveBeenCalledWith(errorCode);
  });

  it('should set "code" property with mapped error code', () => {
    expect(sut).toHaveProperty('code', mappedErrorCode);
  });

  it('should have "statusCode" property set up if passed', () => {
    expect(sut).toHaveProperty('statusCode', errorCode);
  });

  it('should have "statusCode" property set up as 500 if not passed', () => {
    const error = new HttpError(errorMessage);

    expect(error).toHaveProperty('statusCode', 500);
  });
});
