import { BaseError } from './BaseError';

export abstract class InfraError extends BaseError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}
