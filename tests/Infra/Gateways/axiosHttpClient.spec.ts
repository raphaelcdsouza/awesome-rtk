import axios from 'axios';

import { AxiosHttpClient } from '../../../src/Infra/Gateways';
import { HttpMethodsType } from '../../../src/Infra/Interfaces/Gateways';
import { HttpError } from '../../../src/Errors';

jest.mock('axios');
jest.mock('../../../src/Errors/HttpError', () => ({
  HttpError: jest.fn(),
}));

const axiosSpy = axios as jest.Mocked<typeof axios>;

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient;

  const requestUrl = 'any_url';
  const requestMethod = 'GET' as HttpMethodsType;
  const requestHeaders = { any_header: 'any_value' };
  const requestData = { any_data: 'any_value' };
  const requestParams = { any_param: 'any_value' };
  const requestObject = {
    url: requestUrl,
    method: requestMethod,
    headers: requestHeaders,
    data: requestData,
    params: requestParams,
  };

  const responseData = 'any_response_data';
  const responseObject = {
    data: responseData,
  };

  const errorMessage = 'any_error_message';
  const errorStatus = 500;
  const errorObject = {
    message: errorMessage,
    response: {
      status: errorStatus,
    },
  };

  beforeEach(() => {
    sut = new AxiosHttpClient();
  });

  beforeAll(() => {
    jest.mocked(axiosSpy).mockResolvedValue(responseObject);
  });

  it('should call axios with correct values', async () => {
    await sut.request(requestObject);

    expect(axios).toHaveBeenCalledWith(requestObject);
  });

  it('should return the correct response', async () => {
    const result = await sut.request(requestObject);

    expect(result).toEqual(responseData);
  });

  it('it should throw HttpError if axios throws', async () => {
    jest.mocked(axiosSpy).mockRejectedValueOnce(errorObject);

    const promise = sut.request(requestObject);

    await expect(promise).rejects.toBeInstanceOf(HttpError);
    expect(HttpError).toHaveBeenCalledTimes(1);
    expect(HttpError).toHaveBeenCalledWith(errorMessage, errorStatus);
  });
});
