import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
// import { userInfoApi } from '../../services'
import { userInfo } from '../../types/api'


export const getUserInfo = createAsyncThunk('getUserInfo', async () => {
  // const res = await userInfoApi()
  // return res.data
})

interface userState {
  userInfo: userInfo;
  count: number;
  test: string;
}

// 初始值
const initialState: userState = {
  userInfo: {} as userInfo,
  count: 0,
  test: '123'
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
      .addCase(getUserInfo.fulfilled, (state, action) => {
        // state.userInfo = action.payload.values
        console.log('获取用户信息成功')
      })
  }
})


export default userSlice.reducer