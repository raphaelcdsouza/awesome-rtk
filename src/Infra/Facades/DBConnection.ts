import { MySQLConnection, PostgresConnection } from '../DB';
import { ISQLDatabase } from '../Interfaces/DB';
import { DBConnectionType } from '../Types/DB';

export const DBConnection = (config: DBConnectionType): ISQLDatabase => {
  const { engine, ...dbConfigs } = config;
  if (engine === 'mysql') return new MySQLConnection(dbConfigs);
  return new PostgresConnection(dbConfigs);
};
