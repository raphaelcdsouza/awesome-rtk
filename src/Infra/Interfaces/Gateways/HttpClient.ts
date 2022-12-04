export type HttpMethodsType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface IHttpClient {
  request: <T = any> (params: IHttpClient.Input) => Promise<T>;
}

export namespace IHttpClient {
  export type Input = {
    url: string;
    method: HttpMethodsType;
    headers?: Record<string, string>;
    data?: Record<string, any>;
    params?: Record<string, any>;
  }
}
