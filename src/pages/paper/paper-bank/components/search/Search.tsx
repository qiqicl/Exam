import React from "react"
import { useEffect,useState } from "react"
import { Button, Form, Input, Select, Space, theme } from "antd"
import { examListSearchApi,userListApi,classifyListApi } from "../../../../../services/index"
import type { examListSearchParams,UserListResponse,ClassifyListResponse ,ExamListItem} from "../../../../../types/api"

const { Option } = Select

interface Props {
  search:(searchlist:ExamListItem[]) => void
  re:() => void
}

const Search: React.FC<Props>  = (props) => {
  const { token } = theme.useToken()
  const [form] = Form.useForm()
  const [user, setUser] = useState<UserListResponse["data"]>()
  const [classify,setClassify] = useState<ClassifyListResponse["data"]>()

  const formStyle: React.CSSProperties = {
    maxWidth: 'none',
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 24,
  }

  const onFinish = async (values: examListSearchParams) => {
    console.log('Received values of form: ', values)
    Object.keys(values).forEach((k) => values[k as keyof examListSearchParams] == null && delete values[k as keyof examListSearchParams])
    const arr = []
    for (const key in values) {
      arr.push(`${key}=${values[key as keyof examListSearchParams]}`)
    }
    const str = arr.join('&')
    const res = await examListSearchApi(str)
    console.log(res)
    props.search(res.data.data.list.map((v) => {
      return {...v,createTime:new Date(v.createTime).toLocaleString('zh-cn'),isUpdateNow:false}
    }))
  }

  const userList = async () => {
    const res = await userListApi()
    setUser(res.data.data)
  }

  const classifyList = async () => {
    const res = await classifyListApi()
    setClassify(res.data.data)
  }

  useEffect(() => {
    userList()
    classifyList()
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
          name={"name"}
          label={`试卷名称`}
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
          name={`creater`}
          label={`创建人`}
          rules={[
            {
              required: false,
              message: 'Select something!',
            },
          ]}
          // initialValue="请选择"
        >
          <Select style={{ width: 120 }} placeholder={"请选择"} >
            {user?.list.map((i) => {
              return <Option value={i.username} key={i._id}>{i.username}</Option>
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name={`classify`}
          label={`查询科目`}
          rules={[
            {
              required: false,
              message: 'Select something!',
            },
          ]}
          // initialValue="请选择"
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
