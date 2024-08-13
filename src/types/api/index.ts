
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
    token:string,
  }
}

//验证码
export type code = BaseResponse & {
  data: {
    code:string
  }
}
//用户管理
export type userOptionsType = {
  _id: string,
  username: string,
  password: string,
  status: JSX.Element,
  role: string[],
  creator: string,
  __v: number,
  lastOnlineTime: string | '',
  avator?: JSX.Element | string,
  key:number,
  action:JSX.Element
}
//用户创建
export type userOptionsCreate = {
  username?:string | JSX.Element,
  password?:string | JSX.Element,
  status:number | string | JSX.Element,
  check?:string | JSX.Element,
  id?:string
}
//用户搜索
export type userOptionsSearch = {
  username?:string,
  status?:number
}