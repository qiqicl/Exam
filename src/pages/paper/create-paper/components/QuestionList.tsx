import React, { useState } from 'react'
import { Modal,Divider, Table} from 'antd'
import type { TableColumnsType } from 'antd'
import { QuestionListResponse, QuestionItem } from "../../../../types/api/index"

interface Props {
  open:boolean
  handleCancel:() => void
  setOpen:(b:boolean) => void
  questionList:QuestionListResponse["data"]
  optional:(a:QuestionListResponse["data"]["list"]) => void
}

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

const QuestionList: React.FC<Props> = (props) => {
  const [confirmLoading, setConfirmLoading] = useState(false)

  const columns: TableColumnsType<QuestionItem> = [
    {
      title: '题干',
      dataIndex: 'question',
      render: (text: string) => <a>{text}</a>
    },
    {
      title: '题型',
      dataIndex: "type",
      render: (text: QuestionType) => <a>{QuestionTypeText[text]}</a>
    },
    {
      title: '答案',
      dataIndex: 'answer'
    },
  ]

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: QuestionItem[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      selectedRows[0].checked = true
      props.optional(selectedRows)
      console.log(props.questionList.list)
    }
  }

  const handleOk = () => {
      props.setOpen(false);
      setConfirmLoading(false);
  }


  return <div className="questionList">
          <Modal
            title="试题列表"
            open={props.open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={props.handleCancel}
            okText="确认"
            cancelText="取消"
            style={{maxHeight:400}}
          >
            <Divider />
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={props.questionList.list}
              scroll={{y:390}}
            />
          </Modal>
        </div>
}

export default QuestionList;