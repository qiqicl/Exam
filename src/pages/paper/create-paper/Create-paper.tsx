import React from "react"
import { useState, useEffect,useRef } from "react"
import { Button, message, Steps, theme, Form, Input, Select, Flex, Radio } from "antd"
import { classifyListApi,questionListSearchApi,createExamApi } from "../../../services/index"
import { ClassifyListResponse ,QuestionListResponse, Question} from "../../../types/api/index"
import QuestionList from "./components/QuestionList"
import style from "./create-paper.module.scss"

const { TextArea } = Input;
type CreatMsg = {
  name:string,
  classify:string,
  questions:string[]
}

const CreatePaper = () => {
  const { token } = theme.useToken()
  const [current, setCurrent] = useState(0)
  const [classify, setClassify] = useState<ClassifyListResponse["data"]>()
  const [combination,setCombination] = useState<"a"|"b">("a")
  const [questionList, setQuestionList] = useState<QuestionListResponse["data"]>({} as QuestionListResponse["data"])
  const [name,setName] = useState<string>()
  const [myClassify,setMyClassify] = useState<string>()
  const [randomNum ,setRandomNum] = useState<number>(0)
  const [open, setOpen] = useState<boolean>(false)
  const maxLength = useRef<number>(0)
  const creatMsg = useRef<CreatMsg>({} as CreatMsg)
  const question = useRef<string[]>([])
  const newExam = useRef<QuestionListResponse["data"]["list"]>([])

  const showModal = () => {
    setOpen(true);
  }

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  }

  const next = () => {
    setCurrent(current + 1)
    console.log(creatMsg.current)
    console.log(detailRender())
    // console.log()
  }

  const prev = () => {
    setCurrent(current - 1);
  }

  const classifyList = async () => {
    const res = await classifyListApi()
    console.log(res)
    setClassify(res.data.data)
  }

  useEffect(() => {
    if (current === 1) {
      classifyList()
    }
  }, [current])


  const goRandom = () => {
    if( Object.keys(questionList).length !== 0) {
      if(combination === "b" && randomNum !== 0 ) {
        console.log(questionList.list)
        newExam.current = []
        question.current = []
        for (let i = 0; i < randomNum; i++) {
          const ran = Math.floor(Math.random() * (questionList?.list.length))
          newExam.current.push(questionList?.list.splice(ran, 1)[0])
        }
        newExam.current.forEach((q) => {question.current.push(q?._id)})
      }
    }
    creatMsg.current = {
      "name":name!,
      "classify":myClassify!,
      "questions":question.current!
    }
    console.log(creatMsg.current)
  }

  const changeI = (v:string) => {
    setName(v)
  }

  const optional = (arr:QuestionListResponse["data"]["list"]) => {
    newExam.current = arr
    newExam.current.forEach((q) => {question.current.push(q?._id)})
  }

  const detailRender = () => {
    const render:{ type: "1"|"2"|"3"|"4", title:string,question:Question[] }[] = []
    newExam.current.forEach((v) => {
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

  const changeS = async (e:string) => {
    setMyClassify(e)
    const res = await questionListSearchApi(e as string)
    setQuestionList({...res.data.data,list:res.data.data.list.map((q) => {
      return {...q,checked:false,key:q._id}
    })})
    maxLength.current = res.data.data.list.length
    console.log(res.data.data)
  }

  const changeN = (n:string) => {
    setRandomNum(Number(n))
    console.log(maxLength.current)
    // console.log(randomNum)
    // console.log(Object.keys(questionList).length !== 0 ? questionList.list.length :0)
  }

  const createExam = async () => {
    const res = await createExamApi(creatMsg.current)
    console.log(res)
    message.success(res.data.msg)
  }

  useEffect(() => {
    creatMsg.current = {
      "name":name!,
      "classify":myClassify!,
      "questions":question.current!
    }
    console.log(creatMsg.current)
  },[name,myClassify,question])

  const steps = [
    {
      title: "试卷基础信息",
      content: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600, minWidth: 300, marginTop: 20 }}
            layout={"vertical"}
            autoComplete="off"
          >
            <Form.Item
              label="试卷名称"
              name="name"
              rules={[{ required: true, message: "请输入试卷名称" }]}
              labelAlign={"left"}
            >
              <Input onChange={(e) => changeI(e.target.value)}/>
            </Form.Item>
            <TextArea rows={4} placeholder="备注(选填)" />
          </Form>
        </div>
      ),
    },
    {
      title: "选择组卷方式&科目",
      content: (
        <div>
          <Form
            name="classify"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ minWidth: 300, marginTop: 20 ,justifyContent:"center"}}
            layout={"inline"}
            autoComplete="off"
          >
            <Form.Item
              label="科目"
              name="classify"
              rules={[{ required: true, message: "请选择科目" }]}
            >
              <Select
                showSearch
                placeholder="请选择"
                optionFilterProp="label"
                style={{marginLeft:"10px"}}
                options={classify?.list.map( c => ({value:c.name,label:c.name,key:c._id}))}
                onChange={(e) => changeS(e)}
              />
            </Form.Item>
          </Form>
          <Flex vertical gap="middle" style={{margin:"40px 0"}}>
            <Radio.Group defaultValue="a" buttonStyle="solid">
              <Radio.Button value="a" onClick={() => setCombination("a")}>选题组卷</Radio.Button>
              <Radio.Button value="b" onClick={() => setCombination("b")}>随机组卷</Radio.Button>
            </Radio.Group>
          </Flex>
          {
            combination === "a" ?
            <Button onClick={showModal}>选择试题</Button> :
            <>
            <Input
              type={"number"}
              style={{width:"150px"}}
              addonBefore={"试题数量"}
              onChange={(e) => {changeN(e.target.value)}}
              max={maxLength.current}
            />
            <Button onClick={goRandom}>确认选择</Button>
            </>
          }
        </div>
      ),
    },
    {
      title: "展示试卷基本信息",
      content:
        <div style={{width:"50%",margin:"0 auto",textAlign:"left"}}>
          <div className="header">
            <h4 style={{marginTop:"15px",textAlign:"center"}}>试卷信息</h4>
            <div className={style.title}>试卷名称： {creatMsg.current.name}</div>
            <div className={style.title}>组卷方式： {combination === "a" ? "选题组卷" : "随机组卷"}</div>
            <div className={style.title}>科目： {creatMsg.current.classify}</div>
            <div style={{padding:"20px 0"}}>
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
            </div>
          </div>
        </div>
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    height: "300px",
    width: "70%",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 40,
    overflow:"auto",
  };

  return (
    <>
      <div
        className="creatPaper"
        style={{
          padding: "50px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Steps current={current} items={items} type={"inline"} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div style={{ marginTop: 24 }}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              下一步
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => createExam()}
            >
              提交
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              上一步
            </Button>
          )}
        </div>
      </div>
      <QuestionList open={open} handleCancel={handleCancel} setOpen={setOpen} questionList={questionList} optional={optional}/>
    </>
  )
}

export default CreatePaper;
