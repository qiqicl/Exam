import { Flex ,Radio} from 'antd'
import { useState } from 'react'
import Manual from './components/manual/Manual'
import Batch from './components/batch/Batch'

import style from "./create-item.module.scss"


const CreateItem = () => {
  const [combination, setCombination] = useState<"a" | "b">("a")
  return (
    <div className={style.CreateItem}>
      <Flex vertical gap="middle" style={{margin:"30px 20px"}}>
        <Radio.Group defaultValue="a" buttonStyle="solid">
          <Radio.Button value="a" onClick={() => setCombination("a")}>手动添加</Radio.Button>
          <Radio.Button value="b" onClick={() => setCombination("b")}>批量导入卷</Radio.Button>
        </Radio.Group>
      </Flex>
      <div className={style.main}>
        {combination === "a" ?
        <Manual />:
        <Batch />
        }
      </div>
    </div>
  )
}

export default CreateItem