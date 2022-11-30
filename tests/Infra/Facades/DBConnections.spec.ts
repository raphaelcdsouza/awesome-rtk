import { DBConnection } from '../../../src/Infra/Facades';
import { MySQLConnection, PostgresConnection } from '../../../src/Infra/DB';

jest.mock('../../../src/Infra/DB');

describe('DBConnection', () => {
  const DB_HOST = 'any_host';
  const DB_PORT = 5555;
  const DB_PASSWORD = 'any_password';
  const DB_USER = 'any_user';
  const DB_NAME = 'any_name';

  let sut: any;

  describe('MySQLConnection instance', () => {
    beforeEach(() => {
      sut = DBConnection({
        engine: 'mysql',
        host: DB_HOST,
        port: DB_PORT,
        password: DB_PASSWORD,
        user: DB_USER,
        database: DB_NAME,
      });
    });

    it('should be an instance of MySQLConnection', () => {
      expect(sut).toBeInstanceOf(MySQLConnection);
    });

    it('should call MySQLConnection constructor with correct parameters', () => {
      expect(MySQLConnection).toHaveBeenCalledTimes(1);
      expect(MySQLConnection).toHaveBeenCalledWith({
        host: DB_HOST,
        port: DB_PORT,
        password: DB_PASSWORD,
        user: DB_USER,
        database: DB_NAME,
      });
    });
  });

  describe('PostgresConnection instance', () => {
    beforeEach(() => {
      sut = DBConnection({
        engine: 'postgres',
        host: DB_HOST,
        port: DB_PORT,
        password: DB_PASSWORD,
        user: DB_USER,
        database: DB_NAME,
      });
    });

    it('should be an instance of MySQLConnection', () => {
      expect(sut).toBeInstanceOf(PostgresConnection);
    });

    it('should call PostgresConnection constructor with correct parameters', () => {
      expect(PostgresConnection).toHaveBeenCalledTimes(1);
      expect(PostgresConnection).toHaveBeenCalledWith({
        host: DB_HOST,
        port: DB_PORT,
        password: DB_PASSWORD,
        user: DB_USER,
        database: DB_NAME,
      });
    });
  });
});
