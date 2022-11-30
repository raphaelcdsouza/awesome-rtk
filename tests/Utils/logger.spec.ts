import { logger } from '../../src/Utils';

describe('logger', () => {
  const param1 = 'any_message';
  const param2 = 3;
  const param3 = true;
  const param4 = ['any', 'array'];
  const param5 = { any: 'object' };

  it('should call "console.log" function with correct params', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(() => undefined);

    logger(param1, param2, param3, param4, param5);

    expect(consoleSpy).toHaveBeenCalledWith(param1, param2, param3, param4, param5);
  });
});
