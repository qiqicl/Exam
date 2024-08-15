import React, { useEffect, useState } from 'react';
import style from './group-list.module.scss'
import {  classAllList, userClassType, classifyType, createClassType } from '../../../types/api/classAndStudent'
import { classListApi, classRemoveApi, calssUserApi, calssifyClassApi, calssCreateApi } from '../../../services/index'
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, message, Form, Input, Select } from 'antd';
import { useRef } from 'react';
// import request from 'umi-request';

const GroupList = () => {
  const [classFlag, setClassFalg] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pagesize, setPageSize] = useState(5)
  const classRef = useRef()
  const [editClassList, setEditClassList] = useState<classAllList[]>([])
  const [userClassList, setUserClassList] = useState<userClassType[]>([])
  const [ClassifyList, setClassifyList] = useState<classifyType[]>([])
  const [form] = Form.useForm()
  const [fouceUpdate, setfouceUpdate] = useState(0)


  const userClassApi = async() => {
    const res = await calssUserApi()
    setUserClassList(res.data.data.list)
    console.log(userClassList);
  }
  const calssifyApi = async() => {
    const res = await calssifyClassApi()
    setClassifyList(res.data.data.list)
    console.log(ClassifyList);
  }
  useEffect(() => {
    userClassApi()
    calssifyApi()
  },[])
  const fouceUpd =() => {
  setfouceUpdate(fouceUpdate+1)
  }
  const changeFlag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === classRef.current) {
      setClassFalg(!classFlag)
    }
  }
  const changeFlag1 = () => {
    setClassFalg(!classFlag)
  }
  const classsSave = (id: string, render: classAllList[]) => {
    console.log(id, render);
  }
  const classDelete = async (time: number, id: string) => {
      const res = await classRemoveApi(time, id);
      console.log(res);
      if (res.data.code === 200) {
        message.success('删除成功')
      } else {
        message.error('删除失败：' + res.data.msg);
      }
  };
  const createInfo = async(d: number) => {
    const value: createClassType = await form.validateFields()
    const res = await calssCreateApi(d, {...value, students: []})
    fouceUpd()
    setClassFalg(!classFlag)
    
  }
  const columns: ProColumns<classAllList>[] = [
    {
      title: '排序',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      disable: true,
      title: '班级名称',
      dataIndex: 'name',
      filters: true,
      onFilter: true,
      copyable: true,
      ellipsis: true,
    },
    {
      title: '老师',
      dataIndex: 'teacher',
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
      title: '科目类别',
      dataIndex: 'classify',
      copyable: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        all: { text: '超长'.repeat(50) }
        
      }
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
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
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record._id);
          }}
        >
          编辑
        </a>,
        <a href="" target="_blank" rel="noopener noreferrer" key="view">
          查看
        </a>,
      ],
    },
  ];

  const actionRef = useRef<ActionType>();
  return (
    <div className="classCon" key={fouceUpdate}>
      <ProTable<classAllList>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口
          console.log(params, sorter, filter);
          const res = await classListApi({ page, pagesize })
          setTotal(res.data.data.total)
          return Promise.resolve({
            data: res.data.data.list,
            success: true,
          });
        }}
        editable={{
          type: 'multiple',
          onSave: classsSave,
          onDelete: (key: any, row) => {
            console.log(key, row);
            classDelete(row.createTime, row._id)
          },
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
        rowKey="_id"
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
          total,
          pageSizeOptions: [5, 10, 15, 20],
          pageSize: pagesize,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPage(page)
            setPageSize(pageSize)
            classListApi({ page, pagesize })
            console.log(page, pageSize)
          },
        }}
        dateFormatter="string"
        headerTitle="班级表格"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              // actionRef.current?.reload()
              setClassFalg(!classFlag)
            }}
            type="primary"
          >
            新建班级
          </Button>,
        ]}
      />
      {classFlag ?
        <div className={style.addClass} ref={classRef} onClick={changeFlag}>
          <div className={style.addClassInter}>
            <div className={style.addConHeader}>
              <Space>
                <span onClick={changeFlag1}>×</span>
                <p>新建班级</p>
              </Space>
            </div>
            <div className={style.addConMain}>
              <Form
                name="basic"
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item<classAllList>
                  label="班级名称"
                  name="name"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="老师" name="teacher">
                  <Select>
                    {userClassList.map(item => <Select.Option value={item.username}>{item.username}</Select.Option>)}
                  </Select>
                </Form.Item>
                <Form.Item label="科目类别" name="classify">
                  <Select>
                    {ClassifyList.map(item => <Select.Option value={item.name}>{item.name}</Select.Option>)}
                  </Select>
                </Form.Item>
              </Form>
            </div>
            <div className={style.addConFooter}>
              <Space>
                <Button
                  key="button"
                  onClick={changeFlag1}
                  type="default"
                >
                  取消
                </Button>
                <Button
                  key="button"
                  onClick={() => createInfo(Date.now())}
                  type="primary"
                >
                  确定
                </Button>
              </Space>
            </div>
          </div>
        </div>
        : ''
      }
    </div>
  );
};
export default GroupList