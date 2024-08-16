import { useEffect, useState ,useRef} from "react";
import {
  examListApi,
  examDetailApi,
  examRemoveApi,
  examUpdateApi,
  questionListApi,
} from "../../../services/index"
import {  ExamListItem,ExamDetailRespanse ,QuestionItem } from "../../../types/api"
import { Space, Button ,Table, Popconfirm ,message, Input} from 'antd'
import type { TableProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import Draw from "./components/draw/Draw"
import Search from "./components/search/Search";
import style from "./Item-bank.module.scss"


type DataType = QuestionItem & {isUpdateNow :boolean,key:string}

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
  const [list, setList] = useState<ExamListItem[]>([])
  const [open, setOpen] = useState(false)
  const updateItem = useRef<{id:string,name:string}>({} as {id:string,name:string})
  const [detail,setDetail] = useState<ExamDetailRespanse["data"]>({} as ExamDetailRespanse["data"])

  const [questionList,setQuestionList] = useState<DataType[]>([])


  const showDrawer = (id:string) => {
    setOpen(true)
    getExamDetail({id})
  }
  const onClose = () => {
    setOpen(false)
  }
  const navigate = useNavigate()
  const getExamList = async () => {
    const res = await examListApi()
    setList(res.data.data.list.map((v) => {
      return {...v,createTime:new Date(v.createTime).toLocaleString('zh-cn'),isUpdateNow:false}
    }))
  }
  const getExamDetail = async ({id}:{id:string}) => {
    const res = await examDetailApi({id})
    console.log(res.data.data)
    setDetail(res.data.data)
  }

  const getQuestionList = async () => {
    const res = await questionListApi()
    console.log(res.data.data.list)
    setQuestionList(res.data.data.list.map((v) => {
      return {...v,isUpdateNow:false,key:v._id}
    }))
  }

  useEffect(() => {
    getExamList()
    getQuestionList()
  }, [])

  const del = async (id:string) => {
    console.log(id)
    const res = await examRemoveApi({id})
    console.log(res)
    message.success({
      content: res.data.msg
    })
    getExamList()
  }

  const isUpdate = async (id:string,index:number) => {
    const newList = structuredClone(list)
    newList.forEach(i => {
      i.isUpdateNow = false
    })
    newList.splice(index,1,{...list[index],isUpdateNow:true})
    setList(newList)
  }

  const examUpdateItem = (id:string,v:string) => {
    updateItem.current.id = id
    updateItem.current.name = v
  }

  const update = async (id:string) => {
    const res = await examUpdateApi({id:id,name:updateItem.current.name})
    console.log(res)
    getExamList()
    message.success({
      content: res.data.msg
    })
  }

  const cancel = () => {
    const newList = structuredClone(list)
    newList.forEach(i => {
      i.isUpdateNow = false
    })
    setList(newList)
  }

  const search = (searchlist:ExamListItem[]) => {
    setList(searchlist)
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
      render: (text: QuestionType,record) => (
        record.isUpdateNow ?
        <Input size="small" defaultValue={record.question} onChange={(e) => {examUpdateItem(record._id,e.target.value)}} className={style.update}/>:
        <a>{QuestionTypeText[text]}</a>
      )
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
            <Button size="small" type="primary" style={{fontSize:"12px"}} onClick={() => {isUpdate(record._id,index)}}>编辑</Button>
            <Popconfirm
            title="删除"
            description="是否删除此试卷"
            okText="删除"
            cancelText="取消"
            onConfirm={() => {del(record._id)}}
            >
              <Button size="small" danger style={{fontSize:"12px"}} onClick={() => {console.log(_)}}>删除</Button>
            </Popconfirm>
            <Button size="small" style={{fontSize:"12px"}}  onClick={() => {showDrawer(record._id)}}>预览试卷</Button>
          </Space>
      ),
    },
  ];

  return <>
          <div className="paperBank">
            <Button onClick={() => {navigate("/question/create-item")}} size="middle" type="primary" style={{fontSize:"13px"}}>创建试题</Button>
            <Search search={search} re={getExamList}/>
            <Table columns={columns} dataSource={questionList} rowKey="_id" scroll={{y:390,x:1000}} style={{width:1500}}/>
          </div>
          <Draw open={open} onClose={onClose} detail={detail}/>
        </>;
}

export default ItemBank