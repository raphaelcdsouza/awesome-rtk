import { ERRORS } from '../Utils/Enums';
import { InfraError } from './InfraError';

export class DatabaseError extends InfraError {
  public readonly engine: string;

  public readonly engineErrorCode: string | number;

  constructor(message: string, code: string, engine: 'postgres' | 'mysql', engineErrorCode: string | number) {
    super(code === ERRORS.DATABASE.UNKNOWN ? 'Unknown error' : message, code);
    this.engine = engine;
    this.engineErrorCode = engineErrorCode;
  }
}
