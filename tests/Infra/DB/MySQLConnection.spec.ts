import { createPool } from 'mysql2/promise';

import { MySQLConnection } from '../../../src/Infra/DB';
import { DatabaseError } from '../../../src/Errors';
import { logger } from '../../../src/Utils';

jest.mock('mysql2/promise');
jest.mock('../../../src/Errors/DatabaseError', () => ({
  DatabaseError: jest.fn(),
}));
jest.mock('../../../src/Utils/logger', () => ({
  logger: jest.fn(),
}));

describe('MySQLConnection', () => {
  const dbName = 'any_database';
  const dbHost = 'any_host';
  const dbPassword = 'any_password';
  const dbPort = 3306;
  const dbUser = 'any_user';

  const query = 'any_query';
  const queryValues = ['any_value'];
  const queryResult = ['any_query_result'];
  const queryResultObject = [queryResult];

  let sut: MySQLConnection;
  let querySpy: jest.Mock;
  let releaseSpy: jest.Mock;
  let getConnectionSpy: jest.Mock;

  beforeAll(() => {
    querySpy = jest.fn();
    releaseSpy = jest.fn();
    getConnectionSpy = jest.fn().mockImplementation(() => ({
      release: releaseSpy,
      query: querySpy,
    }));
    jest.mocked(createPool).mockImplementation(jest.fn().mockImplementation(() => ({
      getConnection: getConnectionSpy,
    })));
  });

  beforeEach(() => {
    sut = new MySQLConnection({
      database: dbName,
      host: dbHost,
      password: dbPassword,
      port: dbPort,
      user: dbUser,
    });
  });

  describe('constructor function', () => {
    it('should call "createPool" constructor with correct parameters', () => {
      expect(sut).toBeDefined();
      expect(createPool).toHaveBeenCalledTimes(1);
      expect(createPool).toHaveBeenCalledWith({
        database: dbName,
        host: dbHost,
        password: dbPassword,
        port: dbPort,
        user: dbUser,
      });
    });
  });

  describe('query function', () => {
    beforeAll(() => {
      querySpy.mockResolvedValue(queryResultObject);
    });

    it('should call "getConnection" method', async () => {
      await sut.query(query);

      expect(getConnectionSpy).toHaveBeenCalledTimes(1);
    });

    it('should call "query" method with correct parameters', async () => {
      await sut.query(query, queryValues);

      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(querySpy).toHaveBeenCalledWith(query, queryValues);
    });

    it('should return query values', async () => {
      const result = await sut.query(query);

      expect(result).toEqual(queryResult);
    });

    describe('on error', () => {
      const OLD_ENV = process.env;

      const mysqlErrorCode = 'any_mysql_error_code';
      const mysqlErrorMessage = 'any_mysql_error_message';
      const mysqlErrorObject = {
        errno: mysqlErrorCode,
        message: mysqlErrorMessage,
      };

      beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV };
        querySpy.mockRejectedValueOnce(mysqlErrorObject);
      });

      afterAll(() => {
        process.env = OLD_ENV;
      });

      it('should throw "DatabaseError" exception, and it needs to call it with correct parameters', async () => {
        const promise = sut.query(query);

        await expect(promise).rejects.toBeInstanceOf(DatabaseError);
        expect(DatabaseError).toHaveBeenCalledTimes(1);
        expect(DatabaseError).toHaveBeenCalledWith(mysqlErrorMessage, expect.any(String), 'mysql', mysqlErrorCode);
      });

      it('should call "logger" function with correct parameters if "NODE_ENV" equals to "development"', async () => {
        process.env.NODE_ENV = 'development';

        try {
          await sut.query(query);
        } catch {
          expect(logger).toHaveBeenCalledTimes(1);
          expect(logger).toHaveBeenCalledWith(mysqlErrorObject);
        }
      });

      it('should not call "logger" "NODE_ENV" not equal to "development"', async () => {
        try {
          await sut.query(query);
        } catch {
          expect(logger).toHaveBeenCalledTimes(0);
        }
      });
    });

    describe('release function', () => {
      it('should call "release" method when query is resolved', async () => {
        await sut.query(query);

        expect(releaseSpy).toHaveBeenCalledTimes(1);
      });

      it('should call "release" method when query is rejected', async () => {
        querySpy.mockRejectedValueOnce('any_error');

        try {
          await sut.query(query);
        } catch {
          expect(releaseSpy).toHaveBeenCalledTimes(1);
        }
      });
    });
  });
});
