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
    CreateExamResponse,
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

