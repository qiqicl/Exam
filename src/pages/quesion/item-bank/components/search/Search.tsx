import React from "react"
import { useEffect,useState } from "react"
import { Button, Form, Input, Select, Space, theme } from "antd"
import { classifyListApi ,questionTypeApi,questionListFilterApi } from "../../../../../services/index"
import type {
  examListSearchParams,
  ClassifyListResponse,
  QuestionTypeResponse,
  QueationDataType
} from "../../../../../types/api"

const { Option } = Select

interface Props {
  search:(searchlist:QueationDataType[]) => void
  re:() => void
}

const Search: React.FC<Props>  = (props) => {
  const { token } = theme.useToken()
  const [form] = Form.useForm()
  const [classify,setClassify] = useState<ClassifyListResponse["data"]>()

  const [questionType,setQuestionType] = useState<QuestionTypeResponse["data"]["list"]>([] as QuestionTypeResponse["data"]["list"])

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

  const onFinish = async (values: examListSearchParams) => {
    console.log('Received values of form: ', values)
    Object.keys(values).forEach((k) => values[k as keyof examListSearchParams] == null && delete values[k as keyof examListSearchParams])
    const arr = []
    for (const key in values) {
      arr.push(`${key}=${values[key as keyof examListSearchParams]}`)
    }
    const str = arr.join('&')
    const res = await questionListFilterApi(str)
    console.log(res)
    props.search(res.data.data.list.map((v) => {
      return {...v,isUpdateNow:false}
    }))
  }


  const classifyList = async () => {
    const res = await classifyListApi()
    setClassify(res.data.data)
  }

  useEffect(() => {
    classifyList()
    getQuestionType()
  },[])

  return (
    <div className="search" style={{margin:"10px 0"}}>
      <Form
        form={form}
        name="advanced_search"
        style={formStyle}
        onFinish={onFinish}
        layout={"inline"}
      >
        <Form.Item
          name={"question"}
          label={`题目名称`}
          rules={[
            {
              required: false,
              message: 'Input something!',
            },
          ]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name={`type`}
          label={`题型`}
          rules={[
            {
              required: false,
              message: 'Select something!',
            },
          ]}
        >
          <Select style={{ width: 120 }} placeholder={"请选择"} >
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
              required: false,
              message: 'Select something!',
            },
          ]}
        >
          <Select style={{ width: 120 }} placeholder={"请选择"}>
          {classify?.list.map((i) => {
              return <Option value={i.name} key={i._id}>{i.name}</Option>
            })}
          </Select>
        </Form.Item>
        <div style={{ textAlign: "right" }}>
          <Space size="small">
            <Button type="primary" htmlType="submit">查询</Button>
            <Button onClick={() => {form.resetFields();props.re()}}>重置</Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default Search;
