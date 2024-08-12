import { configureStore } from '@reduxjs/toolkit'
import userReducer from './models/user'

const store = configureStore({
  reducer: {
    user: userReducer
  }
})

// 根据 store.getState 的类型推论出 store 的类型
export type RootState = ReturnType<typeof store.getState>
// 推论出 dispatch 类型
export type AppDispatch = typeof store.dispatch

export default store