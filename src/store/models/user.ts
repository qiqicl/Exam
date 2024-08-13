import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { userOptionRoleApi } from '../../services'
import type {SelectProps} from "antd";

// import { userInfo } from '../../types/api'


export const getRole = createAsyncThunk('getRole', async () => {
  const res = await userOptionRoleApi()

  return res.data.data.list
})

interface userState {
  count: number;
  test: string;
  options: SelectProps['options']
}

// 初始值
const initialState: userState = {
  count: 0,
  test: '123',
  options:[]
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
      .addCase(getRole.fulfilled, (state, action) => {
        // state.userInfo = action.payload.values
        const options: SelectProps['options'] = []
        action.payload.values.forEach((item:{name:string})=>{
          options.push({
            label: item.name,
            value: item.name
          })
        })
        state.options = options
        console.log('获取用户信息成功')
      })
  }
})


export default userSlice.reducer