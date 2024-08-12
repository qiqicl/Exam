import {
    LoginResponse,
    code,
    LoginParams,
    classListResponse,
    classParams
} from '../types/api'
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

export const classListApi = (page, pagesize) => {
    return request.get<classListResponse>(`/studentGroup/list/?page=${page}&pagesize=${pagesize}`)
}


// https://zyxcl.xyz/exam_api/studentGroup/list?page=1&pagesize=5