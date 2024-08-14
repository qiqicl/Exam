import React from "react"
import {  Drawer } from 'antd'
import { ExamDetailRespanse,Question} from "../../../../../types/api"
import style from "./draw.module.scss"


interface Props {
  open:boolean
  onClose:() => void
  detail:ExamDetailRespanse["data"]
}



const Draw: React.FC<Props>  = (props) => {

  const detailRender = () => {
    const render:{ type: "1"|"2"|"3"|"4", title:string,question:Question[] }[] = []
    props.detail.questions?.forEach((v) => {
      if( v?.type === "1" ) {
        const thisType = render.find((i) => i.type === "1")
        if(!thisType){
          render.push({ type: "1",title:"单选题",question:[v] })
        }else{
          thisType.question.push(v)
        }
      }else if(v?.type === "2"){
        const thisType = render.find((i) => i.type === "2")
        if(!thisType){
          render.push({ type: "2",title:"多选题",question:[v] })
        }else{
          thisType.question.push(v)
        }
      }else if(v?.type === "3"){
        const thisType = render.find((i) => i.type === "3")
        if(!thisType){
          render.push({ type: "3",title:"判断题",question:[v] })
        }else{
          thisType.question.push(v)
        }
      }else if(v?.type === "4"){
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

  return (
    <div className="draw">
      <>
        <Drawer title="试卷预览" onClose={() => {props.onClose()}} open={props.open} width={600}>
          <h3>{props.detail.name}</h3>
          <div className={style.classify}>科目 { props.detail.classify }</div>
          {detailRender().map((item,index) => {
            return <div key={index} className={style.question}>
                    <h4 className={style.type}>{item.title}</h4>
                    {item.question.map((t,index) =>{
                      return <div key={index}>
                        <div className={style.question_item}>{index+1}: {t.question}</div>
                        <div className={style.answer}>{t.options.map((a,index) => {
                          return <span key={index}>{String.fromCharCode(64 + index + 1)}: {a}</span>
                        })}</div>
                      </div>
                    })}
                  </div>
          })}
        </Drawer>
      </>
    </div>
  );
};

export default Draw;
