import {
    LoginResponse,
    code,
    LoginParams,
} from '../types/api'
import request from './request.tsx'

//验证码
export const captchaApi = () => {
    return request.get<code>('/login/captcha')
}
// 登录
export const loginApi = (params:LoginParams) => {
    return request.post<LoginResponse>('/login', params)
}
export const loginStudentApi = (params:LoginParams) => {
    return request.post<LoginResponse>('/login/student', params)
}

// 考试记录

// https://zyxcl.xyz/exam_api/examination/list
export const examRecordApi = () => {
    return request.get<RecordResponse>('/examination/list')
}

// 监考人接口 https://zyxcl.xyz/exam_api/user/list
export const userListApi = () => {
    return request.get<any>('/user/list')
}

// 科目分类接口 https://zyxcl.xyz/exam_api/classify/list
export const classifyApi = () => {
  return request.get<any>('/classify/list')
}
// 考试班级接口 https://zyxcl.xyz/exam_api/studentGroup/list
export const examBanApi = () => {
  return request.get<any>('/studentGroup/list')
}
// 创建考试 中的 第二步 https://zyxcl.xyz/exam_api/exam/list
// https://zyxcl.xyz/exam_api/studentGroup/list  全的数据
export const examListApi = () => {
  return request.get<any>('/exam/list')
}


