// import React from "react";
import * as XLSX from "xlsx"
import { useState } from "react"
import { CloudUploadOutlined } from '@ant-design/icons'
import { Button,  message,Input } from 'antd'
import { createQuestionMultipleApi } from "../../../../../services/index"
import { QuestionCreate} from "../../../../../types/api"

import style from "./batch.module.scss"


type ExselItem = {
  answer:number
  classify:string
  options:string
  question:string
  type:number
  desc?:string
}

type QuestionCreateParam = {
  list:QuestionCreate[]
}



const Batch = () => {
  const [newData,setNewData] = useState<QuestionCreateParam>( {} as QuestionCreateParam )
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
        setNewData({list:data.map(i => ({...i,answer:String(i.answer),options:i.options.split(",")}))})
        // console.log(newData)
      } catch {
        message.error("文件类型不正确！")
      }
    }
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files![0])
  }

  const go = async () => {
    const res = await createQuestionMultipleApi(newData)
    console.log(res)
    if(res.data.code === 200){
      message.success(res.data.msg)
    }else{
      message.error(res.data.msg)
    }
  }

  const detailRender = () => {
    const render:{ type: "1"|"2"|"3"|"4", title:string,question:QuestionCreate[] }[] = []
    newData?.list.forEach((v) => {
      if( v?.type === 1 ) {
        const thisType = render.find((i) => i.type === "1")
        if(!thisType){
          render.push({ type: "1",title:"单选题",question:[v] })
        }else{
          thisType.question.push(v)
        }
      }else if(v?.type === 2){
        const thisType = render.find((i) => i.type === "2")
        if(!thisType){
          render.push({ type: "2",title:"多选题",question:[v] })
        }else{
          thisType.question.push(v)
        }
      }else if(v?.type === 3){
        const thisType = render.find((i) => i.type === "3")
        if(!thisType){
          render.push({ type: "3",title:"判断题",question:[v] })
        }else{
          thisType.question.push(v)
        }
      }else if(v?.type === 4){
        const thisType = render.find((i) => i.type === "4")
        if(!thisType){
          render.push({ type: "4",title:"填空题",question:[v] })
        }else{
          thisType.question.push(v)
        }
      }
    })
    return render
  }

  return <div>
          <Button >
          <CloudUploadOutlined />
            <Input type='file' accept='.xlsx, .xls' onChange={(e) => onExcel(e)} />
            <span onClick={() => go()}>上传文件</span>
          </Button>
          <p >支持 .xlsx、.xls 格式的文件</p>
          {
            JSON.stringify(newData) !== "{}" &&
            <div>
            {detailRender().map((item,index) => {
              return <div key={index} className={style.question}>
                      <h4 className={style.type}>{item.title}</h4>
                      {item.question.map((t,index) =>{
                        return <div key={index}>
                          <div className={style.question_item}>{index+1}:({t.classify}) {t.question}</div>
                          <div className={style.answer}>{t.type ===4 ? <span>{t.answer}</span> :t.options.map((a,index) => {
                            return <span key={index}>{String.fromCharCode(64 + index + 1)}: {a}</span>
                          })}</div>
                        </div>
                      })}
                    </div>
            })}
            </div>
          }
        </div>
}

export default Batch
