
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
export type LoginParams = Record<'username' | 'password', string>
export type LoginResponse = BaseResponse & {
  token: string;
}

// 用户信息
export type userInfo = {
  avatar: string;
  id: string;
  no: number;
  username: string;
}
export type UserInfoResponse = BaseValuse<userInfo>

// 用户列表
export type UserListParams = {
  page: number;
  pagesize: number;
}
export type UserItem = {
  age: number;
  email: string;
  id: string;
  no: number;
  password: string;
  sex: 0 | 1;
  username: string;
}
export type UserListResponse = BaseValuse<{
  list: UserItem[];
  total: number;
}>

// 新增用户
export type CreateParams = Omit<UserItem, 'id' | 'no'>