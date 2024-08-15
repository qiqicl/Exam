
export interface BaseResponse {
  code: number;
  msg: string;
}

export interface BaseValuse<T> {
  code: number;
  msg: string;
  values: T
}


// 登录
export type LoginParams = Record<'username' | 'password' | 'code', string>
export type LoginResponse = BaseResponse & {
  data: {
    token: string,
  }
}

//验证码
export type code = BaseResponse & {
  data: {
    code: string
  }
}






