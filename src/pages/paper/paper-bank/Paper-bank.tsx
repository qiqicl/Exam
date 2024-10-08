import { useEffect, useState ,useRef} from "react";
import {
  examListApi,
  examDetailApi,
  examRemoveApi,
  examUpdateApi
} from "../../../services/index"
import {  ExamListItem,ExamDetailRespanse } from "../../../types/api"
import { Space, Button ,Table, Popconfirm ,message, Input} from 'antd'
import type { TableProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import Draw from "./components/draw/Draw"
import Search from "./components/search/Search";
import style from "./paper-bank.module.scss"
import {useAppSelector} from "../../../hooks/store.ts";


interface DataType {
  classify:string
  createTime:string
  creator:string
  name:string
  questions:string[]
  _id:string
  _v?:number
  isUpdateNow?:boolean
}


const PaperBank = () => {
  const [list, setList] = useState<ExamListItem[]>([])
  const [open, setOpen] = useState(false)
  const updateItem = useRef<{id:string,name:string}>({} as {id:string,name:string})
  const [detail,setDetail] = useState<ExamDetailRespanse["data"]>({} as ExamDetailRespanse["data"])
  const [isDel,setIsDel] = useState(false)
  const userInfo = useAppSelector(state => state.user.userInfo)
  useEffect(()=>{
    console.log(userInfo.permission)
    setIsDel( userInfo.permission.some((item)=>{
      return item._id === "6640ce2612a81002923f0ae9"
    }))
  },[userInfo])
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

  useEffect(() => {
    getExamList()
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

  const isUpdate = async (index:number) => {
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
      align:"center",
      title: '试卷名称',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        record.isUpdateNow ?
        <Input size="small" defaultValue={record.name} onChange={(e) => {examUpdateItem(record._id,e.target.value)}} className={style.update}/>:
        record.name
      )
    },
    {
      align:"center",
      title: '科目类型',
      dataIndex: 'classify',
      key: 'classify',
    },
    {
      align:"center",
      title: '总分',
      dataIndex: 'mark',
      key: 'mark',
      width:100
    },
    {
      align:"center",
      title: '创建人',
      key: 'creator',
      dataIndex: 'creator',
    },
    {
      align:"center",
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
    },
    {
      align:"center",
      title: '操作',
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
            {
              isDel?<Popconfirm
                  title="删除"
                  description="是否删除此试卷"
                  okText="删除"
                  cancelText="取消"
                  onConfirm={() => {del(record._id)}}
              >
                <Button size="small" danger style={{fontSize:"12px"}} onClick={() => {console.log(_)}}>删除</Button>
              </Popconfirm>:<div></div>
            }
            <Button size="small" style={{fontSize:"12px"}}  onClick={() => {showDrawer(record._id)}}>预览试卷</Button>
          </Space>
      ),
    },
  ];

  return <>
          <div className="paperBank">
            <Button onClick={() => {navigate("/paper/create-paper")}} size="middle" type="primary" style={{fontSize:"13px"}}>创建试卷</Button>
            <Search search={search} re={getExamList}/>
            <Table columns={columns} dataSource={list} rowKey="_id" scroll={{y:390,x:'max-content'}}/>
          </div>
          <Draw open={open} onClose={onClose} detail={detail}/>
        </>;
};

export default PaperBank;
