export interface BaseResponse {
    code: number;
    msg: string;
}

export interface BaseValuse<T> {
    code: number;
    msg: string;
    values: T
}

export type Question = {
    answer: string
    classify: string
    options: string[]
    question: string
    type: "1" | "2" | "3" | "4"
    __v: number
    _id: string
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

// 试卷列表
export type ExamListResponse = BaseResponse & {
    data: {
        total: number,
        list: {
            _id: string,
            name: string,
            classify: string,
            questions: string[],
            creator: string,
            createTime: number,
            __v: number
        }[],
        page: number,
        pagesize: number,
        totalPage: number
    }
}

export type ExamListItem = {
    classify: string,
    createTime: string,
    creator: string,
    name: string,
    questions: string[],
    _id: string,
    isUpdateNow?: boolean
}

// 筛选
export type examListSearchParams = {
    name?: string,
    creater?: string,
    classify?: string
}

// 试题列表
export type QuestionItem  =  {
  _id: string,
  question: string,
  type: "1"|"2"|"3"|"4",
  classify: string,
  answer: string,
  options: string[],
  desc: string,
  __v: number,
  checked?:boolean,
  key?:string
}

export type QueationDataType = QuestionItem & {isUpdateNow :boolean,key?:string}

export type QuestionListResponse = {
    code: number,
    msg: string,
    data: {
        total: number,
        list: QuestionItem[],
        page?: number,
        pagesize?: number,
        totalPage?: number
    }
}

export type QuestionCreate = {
    question: string,
    type: number,
    classify: string,
    answer: string,
    options:  [],
    desc: string
}

// 试卷详情
export type ExamDetailParams = Record<"id", string>

export type ExamDetailRespanse = {
    code: number,
    msg: string,
    data: {
        _id: string,
        name: string,
        classify: string,
        questions: {
            _id: string,
            question: string,
            type: "1" | "2" | "3" | "4"
            classify: string,
            answer: string,
            options: string[],
            desc: string,
            __v: number
        }[],
        creator: string,
        createTime: number,
        __v: number
    }
}

//删除试卷
export type ExamRemoveRespanse = {
    code: number;
    msg: string;
}

// 编辑试卷
export type ExamUpdateParams = Record<"id" | "name", string>
export type ExamUpdateRespanse = {
    code: number;
    msg: string;
}

export type QuestionUpdateParams = Record<"id" | "question", string>

// 用户列表
export type UserListResponse = {
    code: number,
    msg: string,
    data: {
        total: number,
        list: {
            _id: string,
            username: string,
            password: string,
            status: number,
            __v: number
        }[],
        page?: number,
        pagesize?: number,
        totalPage?: number
    }
}

// 科目列表
export type ClassifyListResponse = {
    code: number,
    msg: string,
    data: {
        total: number,
        list: [
            {
                _id: string,
                name: string,
                value: string,
                creator: string,
                createTime: number,
                __v: number
            }
        ],
        page?: number,
        pagesize?: number,
        totalPage?: number
    }
}

//试卷新增
export type CreateExamParams = {
    name: string,
    classify: string,
    questions: string[]
}

export type CreateExamResponse = {
    code: number;
    msg: string;
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
    key: number,
    action: JSX.Element,
}
//用户创建
export type userOptionsCreate = {
    username?: string | JSX.Element,
    password?: string | JSX.Element,
    status?: number | string | JSX.Element,
    check?: string | JSX.Element,
    id?: string,
    role?:string[]
}
//用户搜索
export type userOptionsSearch = {
    username?: string,
    status?: number
}
//角色列表
export type systemPoleList = {
    _id: string,
    name: string,
    disabled: boolean,
    permission: string[],
    creator: string,
    __v: number,
    createTime: string | '',
    key: number,
    action: JSX.Element,
    width?: string,
    align?: string,
}
//创建角色
export type systemCreatePole = {
    name: string,
    value: number
}
//权限菜单
export type systemMenuListType = {
    key: string,
    name: string,
    disabled?: boolean,
    _id?: string,
    id?: string,
    path?: string,
    isBtn?: boolean | string,
    createTime?: string,
    action?: JSX.Element,
    children: systemMenuListChildren[],
    editable?: boolean
}
export type systemMenuListChildren = {
    key?: string,
    name?: string,
    disabled?: boolean,
    _id?: string,
    id?: string,
    path?: string,
    isBtn?: boolean | string,
    createTime?: string,
    action?: JSX.Element,
    width?: string,
    align?: string,
    editable?: boolean,
    pid?:string,
}
//角色权限更新
export type systemRoleType = {
    permission: string[],
    id: string,
}
//修改权限菜单
export type menuManageChangeType = {
    name: string,
    id: string,
    path: string
}
//创建权限
export type menuManageCreateType = {
    disabled: boolean,
    isBtn: boolean,
    name: string,
    path: string,
    pid: string,
}

//
export interface DataType {
    key: React.Key;
    name: string;
    class: string;
    creator: string;
    createTime: string
}

// 调考试记录 最里面的值
export type listResponse = {
    id: string,
    name: string,
    classify: string,
    creator: string,
    createTime: string,
    status: number,
    examiner: string,
    group: Array<string>[],
    startTime: string,
    endTime: string

}
export type RowResponse = Omit<listResponse, 'code | msg'>


// match的数据类型
export interface matchResponse {
    key: string;
    name: string;
    class: string;
    creator: string;
    createTime: number;
    classify: string;
    _id: string;
}

// match2的数据类型
export interface match2Response {
    key: string;
    name: string;
    class: string;
    creator: string;
    createTime: number
}

// examList 数据类型
export interface examListResponse {
    classify: string;
    createTime: number;
    creator: string;
    name: string;
    _id: string;
}

export interface examinerType {
    examiner: string[]; // 确保 examiner 是一个字符串数组
}

//试题题型列表
export type QuestionTypeResponse = {
    code: number,
    msg: string,
    data: {
        list:
            {
                _id: string,
                name: string,
                value: number
            }[]
    }
}
//修改用户信息
export type systemUpdateInfoType = {
    avator?: string,
    age?: number,
    email?: string,
    sex?: string,
    username?: string,
    permission:systemMenuListChildren[]
}
