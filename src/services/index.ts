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
    menuManageChangeType,
    menuManageCreateType,
    systemCreatePole,
    systemRoleType,
    BaseResponse,
    QuestionTypeResponse,
    QuestionUpdateParams
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
// 登录
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
// 试题列表
export const questionListApi = () => {
    return request.get<QuestionListResponse>(`/question/list`)
}

// 试题类型
export const questionTypeApi = () => {
    return request.get<QuestionTypeResponse>(`/question/type/list`)
}

//试题筛选
export const questionListFilterApi = (params:string) => {
    return request.get<QuestionListResponse>(`/question/list?${params}`)
}

//试题科目筛选
export const questionListSearchApi = (params:string) => {
    return request.get<QuestionListResponse>(`/question/list?classify=${params}`)
}

//删除试题
export const questionRemoveApi = (params:ExamDetailParams) => {
    return request.post<ExamRemoveRespanse>(`/question/remove`,params)
}

//编辑试题
export const questionUpdateApi = (params:QuestionUpdateParams) => {
    return request.post<ExamUpdateRespanse>(`/question/update`,params)
}

// 试卷新建
export const createExamApi = (params:CreateExamParams) => {
    return request.post<CreateExamResponse>(`/exam/create?${Date.now()}`,params)
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
export const  calssCreateApi = (time: number, params:createClassType) => {
    return request.post<createClassType>(`/studentGroup/create?${time}`,params)
}

//新建学生列表  `/student/create${time}`,value   createStudentType

export const  studentCreateApi = (time:number, params: createStudentType) => {
    return request.post< createStudentType>(`/student/create?${time}`,params)
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
//用户左侧权限
export const systemMenuListApi = () => {
    return request.get('/user/menulist',)
}
//角色权限更新
export const systemRoleApi = (params:systemRoleType) => {
    return request.post('/role/update',params)
}
//权限菜单
export const systemAuthorityMenuApi = () => {
    return request.get('/permission/list',)
}
//修改权限菜单
export const systemChangeMenuApi = (params:menuManageChangeType) => {
    return request.post('/permission/update',params)
}
//创建权限
export const systemCreateMenuApi = (params:menuManageCreateType) => {
    return request.post('/permission/create',params)
}
//删除权限
export const systemDelMenuApi = (id:string) => {
    return request.post('/permission/remove',{id})
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
// 个人信息
export const userInfoApi = () => {
    return request.get('/user/info')
}
// 考试记录

// https://zyxcl.xyz/exam_api/examination/list
export const examRecordApi = () => {
    return request.get<RecordResponse>('/examination/list')
}

// 科目分类接口 https://zyxcl.xyz/exam_api/classify/list
export const classifyApi = () => {
  return request.get<any>('/classify/list')
}
// 考试班级接口 https://zyxcl.xyz/exam_api/studentGroup/list
export const examBanApi = () => {
  return request.get<any>('/studentGroup/list')
}

