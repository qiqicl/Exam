// import {} from '../types/api'
// import request from './request.tsx'



// export const loginApi = (params: LoginParams) => {
//   return request.post<LoginResponse>('/api/login', params)
// }
//
//
// export const userInfoApi = () => {
//   return request.get<UserInfoResponse>('/api/user/info')
// }
//
// export const userListApi = (params: UserListParams) => {
//   return request.get<UserListResponse>('/api/userlist', {
//     params
//   })
// }
//
// export const delUserApi = (id: string) => {
//   return request.post<BaseResponse>('/api/user/delete', {
//     id
//   })
// }
//
// export const createUserApi = (params: CreateParams) => {
//   return request.post<BaseResponse>('/api/user/create', params)
// }
//
// export const updateUserApi = (params: UserItem) => {
//   return request.post<BaseResponse>('/api/user/update', params)
// }
//
// export const exportApi = (ids: string[]) => {
//   return request.post('/api/export', { ids }, { responseType: 'blob' })
// }
//
// export const updateAvatarApi = (avatar: string | File | Blob) => {
//   const formData = new FormData()
//   formData.append('avatar', avatar)
//   return request.post('/api/user/avatar', formData)
// }
