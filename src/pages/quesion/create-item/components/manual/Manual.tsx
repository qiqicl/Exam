// import React from 'react'
import { useState,useEffect} from 'react'
import { Input,Form,Select,theme,Space,Button,Radio,message,Checkbox} from 'antd'
import { classifyListApi ,questionTypeApi,createQuestionApi} from "../../../../../services/index"
import type {
  ClassifyListResponse,
  QuestionTypeResponse,
  QuestionCreate,
} from "../../../../../types/api"

const { Option } = Select
const { TextArea } = Input

type  createForm =  QuestionCreate & {aOption:string,bOption:string,cOption:string,dOption:string}

const Manual = () => {
  const { token } = theme.useToken()
  const [classify,setClassify] = useState<ClassifyListResponse["data"]>()
  const [questionType,setQuestionType] = useState<QuestionTypeResponse["data"]["list"]>([] as QuestionTypeResponse["data"]["list"])
  const [newType,setNewType] = useState<string>("1")
  const [form] = Form.useForm()

  const formStyle: React.CSSProperties = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  }

  const  getQuestionType = async () => {
    const res = await questionTypeApi()
    console.log(res.data.data.list)
    setQuestionType(res.data.data.list)
  }

  const classifyList = async () => {
    const res = await classifyListApi()
    setClassify(res.data.data)
  }

  useEffect(() => {
    classifyList()
    getQuestionType()
  },[])

  const answer = (a:string | string[]) => {
    if(newType === "1") {
      return String.fromCharCode(64 + Number(a))
    }else if(newType === "2"){
      return (a as string[]).map(i => String.fromCharCode(64 + Number(i))).toString()
    }else if(newType === "3"){
      return a === "1" ? "对" : "错"
    }else if(newType === "4"){
      return a
    }
  }

  const onFinish = async (values: createForm) => {
    const newValues = {
      question:values.question,
      type:values.type,
      classify:values.classify,
      answer:answer(values.answer),
      options:newType === "3" ? ["对","错"] : newType === "4" ? [answer(values.answer)]:[values.aOption,values.bOption,values.cOption,values.dOption],
      desc:values.desc
    }
    console.log('Received values of form: ',JSON.parse(JSON.stringify(newValues)))
    const res = await createQuestionApi(JSON.parse(JSON.stringify(newValues)))
    console.log(res)
    message.success(res.data.msg)
    if(res.data.code === 200) {
      form.resetFields()
    }
  }


  const typechange = (type:number) => {
    console.log("切换题型",type,typeof type)
    setNewType(String(type))
  }

  return (
    <div className='manual'>
      <Form
        form={form}
        name="advanced_search"
        style={formStyle}
        onFinish={onFinish}
        layout={"horizontal"}
      >
        <Form.Item
          name={`type`}
          label={`题型`}
          rules={[
            {
              required: true,
              message: '请选择题型',
            },
          ]}
        >
          <Select style={{ width: 120 }} placeholder={"请选择"} onChange={(e) => {typechange(e)}}>
            {questionType.map((i) => {
              return <Option value={i.value} key={i._id}>{i.name}</Option>
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name={`classify`}
          label={`科目`}
          rules={[
            {
              required: true,
              message: '请选择科目',
            },
          ]}
        >
          <Select style={{ width: 120 }} placeholder={"请选择"}>
          {classify?.list.map((i) => {
              return <Option value={i.name} key={i._id}>{i.name}</Option>
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name={"question"}
          label={`题目`}
          rules={[
            {
              required: true,
              message: '请选择答案',
            },
          ]}
        >
          <TextArea
            showCount
            maxLength={100}
            placeholder="请输入题目"
            style={{ height: 120, resize: 'none'}}
          />
        </Form.Item>
        <Form.Item
          name={"answer"}
          label={`选项`}
          rules={[
            {
              required: true,
              message: '请输入答案',
            },
          ]}
        >
          {newType === "1" &&
          <Radio.Group >
            <Radio value={"1"} id='A' style={{margin:"5px 0"}}>
              <Form.Item  label="A" name='aOption' rules={[{required:true,message:'请输入选项'}]} style={{marginBottom:0}}>
                  <Input/>
              </Form.Item>
            </Radio>
            <Radio value={"2"} id='B' style={{margin:"5px 0"}}>
              <Form.Item  label="B" name='bOption' rules={[{required:true,message:'请输入选项'}]} style={{marginBottom:0}}>
                  <Input />
              </Form.Item>
            </Radio>
            <Radio value={"3"} id='C' style={{margin:"5px 0"}}>
              <Form.Item  label="C" name='cOption' rules={[{required:true,message:'请输入选项'}]} style={{marginBottom:0}}>
                  <Input />
              </Form.Item>
            </Radio>
            <Radio value={"4"} id='D' style={{margin:"5px 0"}}>
              <Form.Item  label="D" name='dOption' rules={[{required:true,message:'请输入选项'}]} style={{marginBottom:0}}>
                  <Input />
              </Form.Item>
            </Radio>
          </Radio.Group>}
          {newType === "2" &&
          <Checkbox.Group >
            <Checkbox value={"1"} id='A' style={{margin:"5px 0"}}>
              <Form.Item  label="A" name='aOption' rules={[{required:true,message:'请输入选项'}]} style={{marginBottom:0}}>
                  <Input />
              </Form.Item>
            </Checkbox>
            <Checkbox value={"2"} id='B' style={{margin:"5px 0"}}>
              <Form.Item  label="B" name='bOption' rules={[{required:true,message:'请输入选项'}]} style={{marginBottom:0}}>
                  <Input />
              </Form.Item>
            </Checkbox>
            <Checkbox value={"3"} id='C' style={{margin:"5px 0"}}>
              <Form.Item  label="C" name='cOption' rules={[{required:true,message:'请输入选项'}]} style={{marginBottom:0}}>
                  <Input />
              </Form.Item>
            </Checkbox>
            <Checkbox value={"4"} id='D' style={{margin:"5px 0"}}>
              <Form.Item  label="D" name='dOption' rules={[{required:true,message:'请输入选项'}]} style={{marginBottom:0}}>
                  <Input />
              </Form.Item>
            </Checkbox>
          </Checkbox.Group>}
          {newType === "3" &&
          <Radio.Group >
          <Radio value={"1"}  style={{margin:"5px 0"}}>对</Radio>
          <Radio value={"2"}  style={{margin:"5px 0"}}>错</Radio>
          </Radio.Group>}
          {newType === "4" &&
          <TextArea
          showCount
          maxLength={100}
          placeholder="请输入答案"
          style={{ height: 100, resize: 'none'}}
        />}
        </Form.Item>
        <Form.Item
          name={"desc"}
          label={`解析`}
          rules={[
            {
              required: false,
              message: 'Input something!',
            },
          ]}
        >
          <TextArea
            showCount
            maxLength={100}
            // onChange={onChange}
            placeholder="请输入注释(选填)"
            style={{ height: 120, resize: 'none' ,width: 350}}
          />
        </Form.Item>
        <Space size="small">
            <Button type="primary" htmlType="submit">提交</Button>
            <Button onClick={() => {form.resetFields()}}>重置</Button>
          </Space>
      </Form>
    </div>
  )
}

export default Manual