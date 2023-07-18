import { InfraError } from './InfraError';
import { ERRORS } from '../Utils/Enums';

export class IdentityProviderError extends InfraError {
  public readonly provider: string;

  public readonly providerErrorCode: string;

  constructor(message: string, code: string, provider: 'aws', providerErrorCode: string) {
    super(code === ERRORS.IDENTITY_PROVIDER.UNKNOWN ? 'Unknown error' : message, code);
    this.provider = provider;
    this.providerErrorCode = providerErrorCode;
  }
}
