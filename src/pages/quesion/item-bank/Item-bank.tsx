import { useEffect, useState ,useRef} from "react";
import {
  questionListApi,
  questionRemoveApi,
  questionUpdateApi
} from "../../../services/index"
import { QuestionItem } from "../../../types/api"
import { Space, Button ,Table, Popconfirm ,message, Input} from 'antd'
import type { TableProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import Draw from "./components/draw/Draw"
import Search from "./components/search/Search";
import style from "./Item-bank.module.scss"


type DataType = QuestionItem & {isUpdateNow :boolean,key?:string}

enum QuestionType  {
  danxuan = '1',
  duoxuan = '2',
  panduan = "3",
  jianda = "4"
}
const QuestionTypeText = {
  [QuestionType.danxuan] : '单选题',
  [QuestionType.duoxuan] : '多选题',
  [QuestionType.panduan] : '判断题',
  [QuestionType.jianda] : '简答题',
}



const ItemBank = () => {
  const [open, setOpen] = useState(false)
  const updateItem = useRef<{id:string,question:string}>({} as {id:string,question:string})
  const [detail,setDetail] = useState<QuestionItem>({} as QuestionItem)

  const [questionList,setQuestionList] = useState<DataType[]>([])


  const showDrawer = (question :QuestionItem) => {
    setOpen(true)
    setDetail(question)
  }
  const onClose = () => {
    setOpen(false)
  }
  const navigate = useNavigate()

  const getQuestionList = async () => {
    const res = await questionListApi()
    console.log(res.data.data.list)
    setQuestionList(res.data.data.list.map((v) => {
      return {...v,isUpdateNow:false,key:v._id}
    }))
  }

  useEffect(() => {
    getQuestionList()
  }, [])

  const del = async (id:string) => {
    console.log(id)
    const res = await questionRemoveApi({id})
    console.log(res)
    message.success({
      content: res.data.msg
    })
    getQuestionList()
  }

  const isUpdate = async (index:number) => {
    const newList = structuredClone(questionList)
    newList.forEach(i => {
      i.isUpdateNow = false
    })
    newList.splice(index,1,{...questionList[index],isUpdateNow:true})
    setQuestionList(newList)
  }

  const examUpdateItem = (id:string,v:string) => {
    updateItem.current.id = id
    updateItem.current.question = v
  }

  const update = async (id:string) => {
    const res = await questionUpdateApi({id:id,"question":updateItem.current.question})
    console.log(res)
    getQuestionList()
    message.success({
      content: res.data.msg
    })
  }

  const cancel = () => {
    const newList = structuredClone(questionList)
    newList.forEach(i => {
      i.isUpdateNow = false
    })
    setQuestionList(newList)
  }

  const search = (searchlist:DataType[]) => {
    setQuestionList(searchlist)
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '题目',
      align:"center",
      dataIndex: 'question',
      width:400,
      render: (_, record) => (
        record.isUpdateNow ?
        <Input size="small" defaultValue={record.question} onChange={(e) => {examUpdateItem(record._id,e.target.value)}} className={style.update}/>:
        record.question
      )
    },
    {
      title: '题型',
      align:"center",
      dataIndex: 'type',
      width:'15%',
      render: (text: QuestionType) => (<a>{QuestionTypeText[text]}</a>)
    },
    {
      title: '科目',
      align:"center",
      dataIndex: 'classify',
      width:'15%',
    },
    {
      title: '创建时间',
      align:"center",
      key: 'createTime',
      dataIndex: 'createTime',
      width:200
    },
    {
      title: '操作',
      align:"center",
      key: 'action',
      fixed: 'right',
      render: (_, record,index) => (
          record.isUpdateNow ?
          <Space size="middle">
            <a onClick={() => {update(record._id)}} style={{color:"#4096ff"}}>确认更新</a>
            <a onClick={() => {cancel()}} style={{color:"#4096ff"}}>取消</a>
          </Space>:
          <Space size="middle">
            <Button size="small" type="primary" style={{fontSize:"12px"}} onClick={() => {isUpdate(index)}}>编辑</Button>
            <Popconfirm
            title="删除"
            description="是否删除此试卷"
            okText="删除"
            cancelText="取消"
            onConfirm={() => {del(record._id)}}
            >
              <Button size="small" danger style={{fontSize:"12px"}} onClick={() => {console.log(_)}}>删除</Button>
            </Popconfirm>
            <Button size="small" style={{fontSize:"12px"}}  onClick={() => {showDrawer(record)}}>预览试题</Button>
          </Space>
      ),
    },
  ];

  return <>
          <div className="paperBank">
            <Button onClick={() => {navigate("/question/create-item")}} size="middle" type="primary" style={{fontSize:"13px"}}>创建试题</Button>
            <Search search={search} re={getQuestionList}/>
            <Table columns={columns} dataSource={questionList} rowKey="_id" scroll={{y:390,x:'max-content'}}/>
          </div>
          <Draw open={open} onClose={onClose} detail={detail}/>
        </>;
}

export default ItemBank