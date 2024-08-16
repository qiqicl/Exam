import React, { useEffect,useRef,useState } from 'react';
import style from './record.module.scss'
import {examRecordApi} from '../../../services/index'
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown } from 'antd';
import {  RowResponse, examListResponse, listType } from '../../../types/api'
import {statusText} from './constants'

const Record: React.FC = () => {

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
      key: 'showTime',
      dataIndex: 'createTime',
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
      render: (_status, record) => {
         return statusText[record.status]?.val
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
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_text, record, _, action) => [
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
  // 横竖实现横滚
  const scroll = {
    y:380,
    x:"1500px"
  }
  return (
    <div className={style.wrap}>
      <div className={style.head}>考试记录</div>
      <div className={style.table}>
      <ProTable<RowResponse>
      scroll={scroll}
      columns={columns}
      actionRef={actionRef}
      cardBordered
      rowKey='_id'
      request = {async () => {
        const res = await examRecordApi()
        // console.log(res)
        const list = structuredClone(res.data.data.list)
        // console.log(list)
        list.forEach((item:listType)=>{
          let examiner = ''
          if(typeof item.examiner !== "string"){
            item.examiner.forEach((it: string,i: number)=>{
              examiner += i === item.examiner.length - 1?it:it+","
            })
          }
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