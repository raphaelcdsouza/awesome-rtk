import { InfraError } from './InfraError';
import { ERRORS } from '../Utils/Enums';

export class FileStorageError extends InfraError {
  public readonly provider: string;

  public readonly providerErrorCode: string;

  constructor(message: string, code: string, provider: 'aws', providerErrorCode: string) {
    super(code === ERRORS.FILE_STORAGE.UNKNOWN ? 'Unknown error' : message, code);
    this.provider = provider;
    this.providerErrorCode = providerErrorCode;
  }
}
