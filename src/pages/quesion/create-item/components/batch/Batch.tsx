// import React from "react";
import * as XLSX from "xlsx"
import { useRef } from "react"
import { CloudUploadOutlined } from '@ant-design/icons'
import { Button,  message,Input } from 'antd'
import { createQuestionMultipleApi } from "../../../../../services/index"
import { QuestionCreate } from "../../../../../types/api"


type ExselItem = {
  answer:number
  classify:string
  options:string
  question:string
  type:1
  desc?:string
}

type QuestionCreateParam = {
  list:QuestionCreate[]
}

const Batch = () => {
  const newData = useRef<QuestionCreateParam>( {} as QuestionCreateParam )
  const onExcel = (e :React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    // 获取文件对象
    const { files } = e.target
    //读取文件
    const fileReader = new FileReader()
    fileReader.onload = (event : ProgressEvent<FileReader>) => {
      try {
        const { result } = event.target as FileReader
        // 二进制流表格对象
        const workbook = XLSX.read(result, { type: "binary" })
        let data:ExselItem[] = []
        for (const sheet in workbook.Sheets) {
          if (Object.prototype.hasOwnProperty.call(workbook.Sheets, sheet)) {
            data = data.concat(
              XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
            )
            // break
          }
        }
        console.log(data)
        newData.current.list = data.map(i => ({...i,answer:String(i.answer),options:i.options.split(",")}))
        console.log(newData.current)
      } catch {
        message.error("文件类型不正确！")
      }
    }
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files![0])
  }

  const go = async () => {
    const res = await createQuestionMultipleApi(newData.current)
    console.log(res)
    if(res.data.code === 200){
      message.success(res.data.msg)
    }else{
      message.error(res.data.msg)
    }
  }

  return <div>
          <Button >
          <CloudUploadOutlined />
            <Input type='file' accept='.xlsx, .xls' onChange={(e) => onExcel(e)} />
            <span onClick={() => go()}>上传文件</span>
          </Button>
          <p >支持 .xlsx、.xls 格式的文件</p>
        </div>
}

export default Batch
