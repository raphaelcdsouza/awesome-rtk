/* eslint-disable max-classes-per-file */
import { InfraError } from '../../../../src/Errors';
import { AwsServiceTemplate } from '../../../../src/Infra/Gateways/Templates/AWS';

const awsServiceInstanceMock = {
  any: 'any_property',
};

const errorMessage = 'any_message';
const errorCode = 'any_code';

class InfraErrorStub extends InfraError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}

class AwsServiceStub extends AwsServiceTemplate {
  result = 'any_resultany_param';

  constructor() {
    super(awsServiceInstanceMock);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async performAction(serviceInstance: typeof awsServiceInstanceMock, params: any): Promise<any> {
    return this.result;
  }

  throwError(err: any): InfraError {
    return new InfraErrorStub(err.message, err.code);
  }
}

describe('AwsServiceTemplate', () => {
  let sut: AwsServiceStub;

  const paramsObject = {
    any: 'any_param',
  };

  beforeEach(() => {
    sut = new AwsServiceStub();
  });

  it('should throw an instance of "InfraError" if "performAction" throws', async () => {
    jest.spyOn(sut, 'performAction').mockRejectedValueOnce({ message: errorMessage, code: errorCode });

    const promise = sut.execute(paramsObject);

    await expect(promise).rejects.toBeInstanceOf(InfraError);
  });

  it('should call "performAction" method with correct params', async () => {
    const performActionSpy = jest.spyOn(sut, 'performAction');

    await sut.execute(paramsObject);

    expect(performActionSpy).toHaveBeenCalledWith(awsServiceInstanceMock, paramsObject);
  });

  it('should return same result as "performAction" method', async () => {
    const result = await sut.execute(paramsObject);

    expect(result).toBe(sut.result);
  });
});
