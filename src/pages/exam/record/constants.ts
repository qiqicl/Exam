// 三元 => 枚举
export enum status {
  finished = 1,
  unfinished = 2,
  doing = 3,
}
// 状态文本映射
export const statusText: any= {
  [status.finished]:{
    val: '已完成'
  },
  [status.unfinished]:{
    val: '未完成'
  },
  [status.doing]:{
    val: '进行中'
  }
}