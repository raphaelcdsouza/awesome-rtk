import { Readable } from 'stream';

export interface IRetrieveFile {
  retrieveFile: (params: IRetrieveFile.Input) => Promise<IRetrieveFile.Output | undefined>
}

export namespace IRetrieveFile {
  export type Input = {
    key: string
    bucketName: string
  }

  export type Output = {
    data: Buffer
    contentType: string
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
    mimeType?: string
  }
}
