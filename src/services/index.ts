import {BaseValuse} from '../types/api'
import request from './request.tsx'

//验证码
export const captchaApi = () => {
  return request.get<BaseValuse>('/login/captcha')
}
//登录
export const loginApi = (params) => {
  return request.post<BaseValuse>('/login', params)
}
export const loginStudentApi = (params) => {
  return request.post<BaseValuse>('/login/student', params)
}

