import {
    LoginResponse,
    code,
    LoginParams,
    userOptionsCreate,
    userOptionsSearch,
    systemCreatePole, systemRoleType,
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
//删除用户
export const userOptionRemoveApi = (id:string) => {
    return request.post('/user/remove',{id})
}
//角色管理
export const systemRoleListApi = () => {
    return request.get('/role/list')
}
//新增角色
export const systemCreateRoleApi = (params:systemCreatePole) => {
    return request.post('/role/create',params)
}
//删除角色
export const systemDelRoleApi = (id:string) => {
    return request.post('/role/remove',{id})
}
//权限菜单
export const systemMenuListApi = () => {
    return request.get('/user/menulist',)
}
//角色权限更新
// role/update
export const systemRoleApi = (params:systemRoleType) => {
    return request.post('/role/update',params)
}

