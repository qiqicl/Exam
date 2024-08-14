import {
    LoginResponse,
    code,
    LoginParams,
    ExamListResponse,
    ExamDetailParams,
    ExamDetailRespanse,
    ExamRemoveRespanse,
    ExamUpdateParams,
    ExamUpdateRespanse,
    UserListResponse,
    ClassifyListResponse,
    QuestionListResponse,
    CreateExamParams,
    CreateExamResponse
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
// 试卷列表
export const examListApi = () => {
    return request.get<ExamListResponse>('/exam/list')
}
//试卷筛选
export const examListSearchApi = (params:string) => {
    return request.get<ExamListResponse>(`/exam/list?${params}`)
}
//试卷详情
export const examDetailApi = (params:ExamDetailParams) => {
    return request.get<ExamDetailRespanse>(`/exam/detail?id=${params.id}`)
}
//删除试卷
export const examRemoveApi = (params:ExamDetailParams) => {
    return request.post<ExamRemoveRespanse>(`/exam/remove`,params)
}
//编辑试卷
export const examUpdateApi = (params:ExamUpdateParams) => {
    return request.post<ExamUpdateRespanse>(`/exam/update`,params)
}
//查询用户列表
export const userListApi = () => {
    return request.get<UserListResponse>('/user/list')
}
// 查询科目列表
export const classifyListApi = () => {
    return request.get<ClassifyListResponse>('/classify/list')
}
//试题筛选
export const questionListSearchApi = (params:string) => {
    return request.get<QuestionListResponse>(`/question/list?classify=${params}`)
}
// 试题新建
export const createExamApi = (params:CreateExamParams) => {
    return request.post<CreateExamResponse>(`/exam/create?${Date.now()}`,params)
}