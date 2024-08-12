
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


//班级列表

export type classListResponse = {
  code: number,
  data: string;
  msg: string;
}
export type classListItem = {
  list: {
    classify: string;
    createTime: number;
    creator: string;
    name: string;
    student: string;
    teacher: string;
    __v:number;
  };
  total: number;
  totalPage: number;
}
export type classParams = {
  page: number;
  pagesize: number;
}

