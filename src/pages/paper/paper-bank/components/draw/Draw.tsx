import React from "react"
import {  Drawer,Button } from 'antd'
import { ExamDetailRespanse,Question} from "../../../../../types/api"
import style from "./draw.module.scss"
import { useRef } from 'react'
import { jsPDF } from "jspdf"
import domtoimage from 'dom-to-image'


interface Props {
  open:boolean
  onClose:() => void
  detail:ExamDetailRespanse["data"]
}

const Draw: React.FC<Props>  = (props) => {
  const paperRef = useRef<HTMLDivElement>({} as HTMLDivElement)

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

  const exportPDF = async (title: string, ref: HTMLDivElement) => {
    // 根据dpi放大，防止图片模糊
    const scale = 4;
    // 下载尺寸 a4 纸 比例
    const pdf = new jsPDF('p', 'pt', 'a4');
    let width = ref.offsetWidth;
    let height = ref.offsetHeight;

    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;

    // 一页pdf显示html页面生成的canvas高度;
    const pageHeight = contentWidth / 592.28 * 841.89;
    // 未生成pdf的html页面高度
    let leftHeight = contentHeight;
    // 页面偏移
    let position = 0;
    // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    const imgWidth = 575.28;
    const imgHeight = 572.28 / contentWidth * contentHeight;

    // 使用 dom-to-image-more 生成图片
    const imgDataUrl = await domtoimage.toPng(ref, {
        width: width * scale,
        height: height * scale,
        style: {
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            // 确保内容不被遮盖
            position: 'absolute',
            left: '0',
            top: '0',
            margin: '0'
        }
    });

    if (height > 14400) { // 超出jspdf高度限制时
        const ratio = 14400 / height;
        width *= ratio;
    }

    // 缩放为 a4 大小  pdf.internal.pageSize 获取当前pdf设定的宽高
    const pdfWidth = pdf.internal.pageSize.getWidth();
    height = height * pdfWidth / width;
    width = pdfWidth;
    if (leftHeight < pageHeight) {
        pdf.addImage(imgDataUrl, 'png', 0, 0, imgWidth, imgHeight);
    } else {    // 分页
        while (leftHeight > 0) {
            pdf.addImage(imgDataUrl, 'png', 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            // 避免添加空白页
            if (leftHeight > 0) {
                pdf.addPage();
            }
        }
    }
    // 导出下载
    await pdf.save(`${title}.pdf`);
  }

  return (
    <div className="draw">
      <>
        <Drawer title="试卷预览"
        onClose={() => {props.onClose()}}
        open={props.open} width={600}
        extra={
            <Button type="primary" onClick={() => exportPDF(props.detail.name,paperRef.current)}>导出</Button>
        }
        >
          <div ref={paperRef} style={{padding:"20px"}}>
            <h3>{props.detail.name}</h3>
            <div className={style.classify}>科目 { props.detail.classify }</div>
            {detailRender().map((item,index) => {
              return <div key={index} className={style.question}>
                      <h4 className={style.type}>{item.title}</h4>
                      {item.question.map((t,index) =>{
                        return <div key={index}>
                          <div className={style.question_item}>{index+1}: {t.question}</div>
                          <div className={style.answer}>{t.type === "4" ? <span>{t.answer}</span> :t.options.map((a,index) => {
                            return <span key={index}>{String.fromCharCode(64 + index + 1)}: {a}</span>
                          })}</div>
                        </div>
                      })}
                    </div>
            })}
          </div>
        </Drawer>
      </>
    </div>
  );
};

export default Draw;
