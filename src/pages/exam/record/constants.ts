// 三元 => 枚举
export enum status {
  finished = 1,
  unfinished = 0
}
export const statusText: any= {
  [status.finished]:{
    val: '已完成'
  },
  [status.unfinished]:{
    val: '未完成'
  }
}