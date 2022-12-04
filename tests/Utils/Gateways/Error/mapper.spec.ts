import { httpErrorMapper } from '../../../../src/Utils/Gateways/Error';
import { ERRORS, HTTP_ERROR_CODES } from '../../../../src/Utils/Enums';

describe('http error mapper', () => {
  it('should return "E01001 when 404 is passed', () => {
    expect(httpErrorMapper(HTTP_ERROR_CODES.NOT_FOUND)).toBe(ERRORS.HTTP.NOT_FOUND);
  });

  it('should return "E01002 when 401 is passed', () => {
    expect(httpErrorMapper(HTTP_ERROR_CODES.UNAUTHORIZED)).toBe(ERRORS.HTTP.UNAUTHORIZED);
  });

  it('should return "E01003 when 403 is passed', () => {
    expect(httpErrorMapper(HTTP_ERROR_CODES.FORBIDDEN)).toBe(ERRORS.HTTP.FORBIDDEN);
  });

  it('should return "E01004 when 400 is passed', () => {
    expect(httpErrorMapper(HTTP_ERROR_CODES.BAD_REQUEST)).toBe(ERRORS.HTTP.BAD_REQUEST);
  });

  it('should return "E01005 when 500 is passed', () => {
    expect(httpErrorMapper(HTTP_ERROR_CODES.SERVER_ERROR)).toBe(ERRORS.HTTP.SERVER_ERROR);
  });

  it('should return "E01000 when 0 is passed', () => {
    expect(httpErrorMapper(0)).toBe(ERRORS.HTTP.UNKNOWN);
  });
});
