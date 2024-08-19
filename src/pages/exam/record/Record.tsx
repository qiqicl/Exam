import React, { useEffect, useRef, useState } from 'react';
import style from './record.module.scss'
import {examRecordApi, classifyListApi,classListApi1} from '../../../services/index'
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import {  chaxun, listResponse, listType } from '../../../types/api'
import {statusText} from './constants'
import { classifyType } from '../../../types/api/classAndStudent';

const Record: React.FC = () => {
  const [classify, setClassify] = useState<classifyType[]>([]);
  const [classBan, setClassBan] = useState<classifyType[]>([])

  const actionRef = useRef<ActionType>();
  // 横竖实现横滚
  const scroll = {
    y:380,
    x:"1500px"
  }
  const resetStatus = {
    '已完成':'已完成',
    '未完成':'未完成',
    '进行中':'进行中'
  }
  
  useEffect(() => {
    // 调用 科目分类 接口并处理返回的数据 
    const getClassify = async () => {
      try {
        const res = await classifyListApi()
        setClassify(res.data.data.list)
      } catch (error) {
        console.log(error)
      }
    }
    console.log(classify)
    getClassify()
    // 调用 考试班级 接口并处理返回的数据 
    const getClassBanify = async () => {
      try {
        const res = await classListApi1()
        setClassBan(res.data.data.list)
        // console.log(classBan)
      } catch (error) {
        console.log(error)
      }
    }
    getClassBanify()
  },[])
    // 将选项数组转换为 filters 所需的格式
    const resetClassify = classify.reduce((prev: any,{name}: any) => {
      prev[name] = name
      return prev;
    }, {})

  // 将选项数组转换为 filters 所需的格式
  const resetClassBan = classBan.reduce((prev: any,{name}: any) => {
    prev[name] = name
    return prev;
  }, {})
  
  // 每行数据渲染
  const columns: ProColumns<listResponse>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '考试名称',
      dataIndex: 'name',
      onFilter: (value, record) => record.name === value,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      disable: true,
      title: '科目分类',
      dataIndex: 'classify',
      filters: true,
      onFilter: (value, record) => record.classify === value,
      ellipsis: true,
      valueType: 'select',
      valueEnum: resetClassify,
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      onFilter: (value, record) => record.creator === value,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createTime',
      onFilter: (value, record) => record.createTime === value,
    },
    {
      disable: true,
      title: '状态',
      dataIndex: 'status',
      filters: true,
      onFilter: (value, record) => record.status === value,
      ellipsis: true,
      valueType: 'select',
      valueEnum: resetStatus,
      // 将 返回的数据 1 转成已完成  用枚举实现
      render: (_status, record) => statusText[record.status]?.val || '未知状态',
    },
    {
      title: '监考人',
      dataIndex: 'examiner',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          }
        ],
      },
      render:(text, record, index) => {
        const examiners = Array.isArray(text) ? text : [];
        return (
          <Space>
             {examiners.map((examiner, examinerIndex) => (
              <p key={examinerIndex}>{examiner}</p>
             ))}
          </Space>
        )
      }
    },
    {
      disable: true,
      title: '考试班级',
      dataIndex: 'group',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: resetClassBan,
    },
    {
      title: '考试时间',
      dataIndex: 'startTime',
    },

    {
      title: '设置',
      valueType: 'option',
      key: 'option',
      render: (_text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
          }}
        >
          预览试卷
        </a>,
        <a rel="noopener noreferrer" key="view">
          删除
        </a>,
      ],
    },
    {
      title: '设置',
      valueType: 'option',
      key: 'option',
      render: (_text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record._id);
          }}
        >
          成绩分析
        </a>
      ]
    }
  ]



  return (
    <div className={style.wrap} key={fouceUpdate}>
      <div className={style.head}>考试记录</div>
      <div className={style.table}>
      <ProTable<listResponse>
        scroll={scroll}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey='_id'
        request = {async (params:chaxun) => {
          // console.log(params)// 获取输入框的内容
          const res = await examRecordApi({
            classify: params.classify,
            creator:params.creator,
            endTime: params.endTime,
            examiner:params.examiner,
            group: params.group,
            name:params.name,
            showTime:params.showTime,
            startTime:params.startTime,
            status:params.status,
          })

          const list = structuredClone(res.data.data.list)
          // console.log(list)
          list.forEach((item:listType)=>{
            item.startTime = new Date(item.startTime).toLocaleString() || ''
            item.createTime = new Date(item.createTime).toLocaleString() || ''
            item.endTime = new Date(item.endTime).toLocaleString() || ''
          })
          return Promise.resolve({
            data: list,
            success: true,
          })
        }}
        editable={{
          type: 'multiple'
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true }
          },
          onChange(value) {
            console.log('value: ', value);
          }
        }}
        search={{
          labelWidth: 'auto'
        }}
        options={{
          setting: {
            listsHeight: 400
          },
        }}
        form={{
          // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSizeOptions:[5, 10, 20, 50],
        }}
        dateFormatter="string"
        headerTitle="考试记录"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              actionRef.current?.reload();
            }}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />
      </div>
    </div>
  )
}

export default Record;