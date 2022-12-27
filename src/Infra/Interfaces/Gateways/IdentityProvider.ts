type AttributesType = {
  Name: string,
  Value?: string,
}

export interface ISignUp {
  signUp: (params: ISignUp.Input) => Promise<ISignUp.Output>
}

export namespace ISignUp {
  export type Input = {
    username: string
    password: string
    attributes?: AttributesType[]
  }

  export type Output = {
    id: string
  }
}

export interface IConfirmSignUp {
  confirmSignUp: (params: IConfirmSignUp.Input) => Promise<void>
}

export namespace IConfirmSignUp {
  export type Input = {
    username: string
    code: string
  }
}

export interface IResendSignUpConfirmationCode {
  resendSignUpConfirmationCode: (params: IResendSignUpConfirmationCode.Input) => Promise<IResendSignUpConfirmationCode.Output>
}

export namespace IResendSignUpConfirmationCode {
  export type Input = {
    username: string
  }

  export type Output = {
    destination?: string
    deliveryMedium?: string
  }
}

export interface ILogin {
  login: (params: ILogin.Input) => Promise<ILogin.Output>
}

export namespace ILogin {
  export type Input = {
    username: string
    password: string
  }

  export type Output = {
    tokenType: string
    accessToken: string
    refreshToken: string
    idToken: string
  }
}
