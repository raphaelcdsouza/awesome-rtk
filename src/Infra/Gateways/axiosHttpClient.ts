import axios, { AxiosResponse } from 'axios';
import { HttpError } from '../../Errors';

import { IHttpClient } from '../Interfaces/Gateways';

export class AxiosHttpClient {
  async request<T = any>(params: IHttpClient.Input): Promise<T> {
    try {
      const { data } = await axios<any, AxiosResponse<T>>(params);
      return data;
    } catch (err: any) {
      throw new HttpError(err.message, err.response?.status);
    }
  }
}
