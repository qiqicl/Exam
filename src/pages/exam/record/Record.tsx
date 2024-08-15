import React, { useEffect,useRef } from 'react';
import style from './record.module.scss'
import {examRecordApi} from '../../../services/index'
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown } from 'antd';
import {  RowResponse } from '../../../types/api'
import {statusText} from './constants'

const Record: React.FC = () => {

  // 调总数据的接口
  const getRecord = async () => {
    const res = await examRecordApi()
    console.log(res)
  }

  useEffect(() => {
    getRecord()
  },[])

  // 每行数据渲染
  const columns: ProColumns<RowResponse>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '考试名称',
      dataIndex: 'name',
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
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        open: {
          text: '数学',
          status: 'Error',
        },
        closed: {
          text: '英语',
          status: 'Success',
        },
        processing: {
          text: '语文',
          status: 'Processing',
        },
      },
    },
    {
      title: '创建者',
      dataIndex: 'creator',
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
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createTime',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
    },
    {
      disable: true,
      title: '状态',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      // 将 返回的数据 1 转成已完成  用枚举实现
      render: (status, record) => {
         return statusText[record.status].val
      },
      valueEnum: {
        open: {
          text: '已结束',
          status: 'Error',
        },
        closed: {
          text: '未开始',
          status: 'Success',
        },
        processing: {
          text: '进行中',
          status: 'Processing',
        },
      },
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
    },
    {
      disable: true,
      title: '考试班级',
      dataIndex: 'group',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        open: {
          text: '数学',
          status: 'Error',
        },
        closed: {
          text: '英语',
          status: 'Success',
          // disabled: true,
        },
        processing: {
          text: '语文',
          status: 'Processing',
        },
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '开始时间',
      key: 'showTime',
      dataIndex: 'startTime',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '结束时间',
      key: 'showTime',
      dataIndex: 'endTime',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          预览试卷
        </a>,
        <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
          删除
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={() => action?.reload()}
          menus={[
            { key: 'copy', name: '复制' },
            { key: 'delete', name: '删除' },
          ]}
        />,
      ],
    },
  ];

  const actionRef = useRef<ActionType>();



  return (
    <div className={style.wrap}>
      <div className={style.head}>考试记录</div>
      <ProTable<RowResponse>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      rowKey='_id'
      request = {async () => {
        const res = await examRecordApi()
        console.log(res)
        const list = structuredClone(res.data.data.list)
        list.forEach((item:{examiner:string[]|string})=>{
          let examiner = ''
          if(typeof item.examiner !== "string"){
            item.examiner.forEach((it: string,i: number)=>{
              examiner += i === item.examiner.length - 1?it:it+","
            })
          }
          item.examiner = examiner
        })
        return Promise.resolve({
          data: res.data.data.list,
          success: true,
        })
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true },
        },
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 400,
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
        pageSize: 5,
        onChange: (page) => console.log(page),
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
        <Dropdown
          key="menu"
          menu={{
            items: [
              {
                label: '1st item',
                key: '1',
              },
              {
                label: '2nd item',
                key: '2',
              },
              {
                label: '3rd item',
                key: '3',
              },
            ],
          }}
        >
          <Button>
            <EllipsisOutlined />
          </Button>
        </Dropdown>,
      ]}
    />
    </div>
  )
};

export default Record;