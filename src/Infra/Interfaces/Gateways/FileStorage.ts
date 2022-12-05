import { Readable } from 'stream';

export interface IRetrieveFile {
  retrieveFileFromStream: (params: IRetrieveFile.Input) => Promise<Readable>
  retrieveFile: (params: IRetrieveFile.Input) => Promise<Buffer>
}

export namespace IRetrieveFile {
  export type Input = {
    key: string
    bucketName: string
  }
}

export interface IUploadFile {
  uploadFile: (params: IUploadFile.Input) => Promise<string>
}

export namespace IUploadFile {
  export type Input = {
    key: string
    file: string | Buffer | Readable
    bucketName: string
  }
}
