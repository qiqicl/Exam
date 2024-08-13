import {
    LoginResponse,
    code,
    LoginParams,
    userOptionsCreate,
    userOptionsSearch,
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
//用户管理
export const userOptionApi = () => {
    return request.get('/user/list')
}
//创建用户
export const createUserApi = (params:userOptionsCreate) => {
    return request.post('/user/create',params)
}
//用户搜索
export const userOptionSearchApi = (params:userOptionsSearch) => {
    return request.get('/user/list', {params})
}
//用户状态更新
export const userOptionUpdateApi = (params:userOptionsCreate) => {
    return request.post('/user/update', params)
}
//分配角色
export const userOptionRoleApi = () => {
    return request.get('/role/list')
}