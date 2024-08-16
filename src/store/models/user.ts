import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {userInfoApi} from '../../services'
import {systemUpdateInfoType} from "../../types/api";

// import { userInfo } from '../../types/api'


export const getUserInfoStore = createAsyncThunk('getUserInfoStore', async () => {
  const res = await userInfoApi()
  return res.data.data
})

interface userState {
  count: number;
  test: string;
  userInfo:systemUpdateInfoType
}

// 初始值
const initialState: userState = {
  count: 0,
  test: '123',
  userInfo:{}
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addCount(state, action: PayloadAction<number>) {
      state.count = action.payload
    },
    changeTest(state, action: PayloadAction<string>) {
      state.test = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getUserInfoStore.fulfilled, (state, action) => {
        // state.userInfo = action.payload.values
        console.log(action.payload)
        state.userInfo = action.payload
        console.log('获取用户信息成功')
      })
  }
})


export default userSlice.reducer