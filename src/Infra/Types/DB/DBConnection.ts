import { SQLConnectionConfigType } from './SQLConnectionConfig';

export type DBConnectionType = { engine: 'postgres' | 'mysql' } & SQLConnectionConfigType;
