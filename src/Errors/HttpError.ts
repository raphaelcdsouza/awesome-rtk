import { InfraError } from './InfraError';
import { httpErrorMapper } from '../Utils/Gateways/Error';

export class HttpError extends InfraError {
  public readonly statusCode: number;

  constructor(message: string, statusCode?: number) {
    super(message, httpErrorMapper(statusCode));
    this.statusCode = statusCode || 500;
  }
}
