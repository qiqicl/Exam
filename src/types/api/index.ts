
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
//
export interface DataType {
  key: React.Key;
  name: string;
  class: string;
  creator: string;
  createTime: string
}

// 考试记录
export type RecordResponse = BaseResponse & {
  id:string,
  name:string,
  classify:string,
  creator:string,
  createTime:string,
  status:number,
  examiner:string,
  group:Array<string>[],
  startTime:string,
  endTime:string
}
export type RowResponse = Omit<RecordResponse,'code | msg'>


// match的数据类型
export interface matchResponse {
  key:string;
  name:string;
  class:string;
  creator:string;
  createTime:number;
  classify:string;
  _id:string;
}

// match2的数据类型
export interface match2Response {
  key:string;
  name:string;
  class:string;
  creator:string;
  createTime:number
}

// examList 数据类型
export interface examListResponse {
  classify:string;
  createTime:number;
  creator:string;
  name:string;
  _id:string;
}



