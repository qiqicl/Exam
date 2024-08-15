import {
    LoginResponse,
    code,
    LoginParams,
    BaseResponse,
    
} from '../types/api'
import {
    classListResponse,
    classParams,
    createClassType,
    createStudentType,
    saveStudentType,

    
} from '../types/api/classAndStudent.ts'
import request from './request.tsx'

//验证码
export const captchaApi = () => {
    return request.get<code>('/login/captcha')
}
//登录
export const loginApi = (params:LoginParams) => {
    return request.post<LoginResponse>('/login', params)
}
export const loginStudentApi = (params:LoginParams) => {
    return request.post<LoginResponse>('/login/student', params)
}

// 班级列表
export const classListApi = (params: classParams) => {
    return request.get<classListResponse>('/studentGroup/list/', {params})
}
// 学生列表
export const  StudentofClassApi = (params: classParams) => {
    return request.get<classListResponse>('/student/list/', {params})
}

//删除
// https://zyxcl.xyz/exam_api/studentGroup/remove?1723541844519
export const  classRemoveApi = (id:string) => {
    return request.post<BaseResponse>('/studentGroup/remove', {id})
}
// 编辑
// https://zyxcl.xyz/exam_api/studentGroup/update?1723541773961
export const  calssEditApi = (params: string) => {
    return request.post<BaseResponse>(`/studentGroup/update?${params}`)
}
 
// 新建班级列表  /studentGroup/create
export const  calssCreateApi = (time: any, params:createClassType) => {
    return request.post<any>(`/studentGroup/create?${time}`,params)
}

//新建学生列表  `/student/create${time}`,value   createStudentType

export const  studentCreateApi = (time: any, params: createStudentType) => {
    return request.post<any>(`/student/create?${time}`,params)
}

//编辑学生列表
export const  studentEditApi = (eee: number, params: saveStudentType) => {
    return request.post<BaseResponse>(`/student/update?${eee}`, params)
}

// 删除学生列表
// /student/remove
export const  studentRemoveApi = (id:string) => {
    return request.post<BaseResponse>('/student/remove', {id})
}

//用户信息
// https://zyxcl.xyz/exam_api/user/list  time: number, value: 
export const  calssUserApi = () => {
    return request.get<classListResponse>('/user/list')
}


// classify/list 科目
export const  calssifyClassApi = () => {
    return request.get<classListResponse>('/classify/list')
}

// 获取学生信息中的班级信息
// https://zyxcl.xyz/exam_api/studentGroup/list?page=1&pagesize=5
export const  StudentInfoApi = () => {
    return request.get('studentGroup/list')
}