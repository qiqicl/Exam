import React, { useState, useEffect } from 'react';
// import style from './group-students.module.scss'
import style from '../group-list/group-list.module.scss'
import { classAllList, studentAllList, createStudentType, saveStudentType } from '../../../types/api/classAndStudent'
import { StudentofClassApi, StudentInfoApi, studentCreateApi, studentRemoveApi, studentEditApi } from '../../../services/index'
import {  PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Form, Input, Select, message } from 'antd';
import { useRef } from 'react';
// import { data } from '@remix-run/router/dist/utils';
// import request from 'umi-request';

const GroupStudents = () => {
  const [total,setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pagesize, setPageSize] = useState(5)
  const [addStudentsFlag, setAddStudentsFlag] = useState(false)
  const [studentInfoList, setStudentInfoList] = useState<classAllList[]>([])
  const [studentAllList, setStudentAllList] = useState([])
  const actionRef = useRef<ActionType>()
  const studentRef = useRef()
  const [from] = Form.useForm()
  const [fouceUpdate, setfouceUpdate] = useState(0)
  const columns: ProColumns<studentAllList>[] = [
    {
      title: '排序',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      disable: true,
      title: '姓名',
      dataIndex: 'username',
      filters: true,
      onFilter: true,
      copyable: true,
      ellipsis: true,
      valueType: 'select',
    },
    {
      title: '性别',
      dataIndex: 'sex',
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
      title: '年龄',
      dataIndex: 'age',
      copyable: true,
      ellipsis: true,
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
        title: '班级',
        dataIndex: 'className',
        copyable: true,
        ellipsis: true,
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
      ],
    },
  ];
  const fouceUpd =() => {
    setfouceUpdate(fouceUpdate+1)
    }
  const studentI = async() => {
    const res = await StudentInfoApi()
    setStudentInfoList(res.data.data.list);
    console.log(studentInfoList);  
    // const res1 = await 
  }
  useEffect(() => {
    studentI()
  },[])
  console.log(studentInfoList);
  const uniqueArray = studentInfoList.reduce((prev: classAllList[], current) => {
    if (!prev.some(item => item.name === current.name)) {
      prev.push(current)
    }
    return prev;
  }, []);
  console.log(uniqueArray);
  const changeFlag =( e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(e.target === studentRef.current) {
      setAddStudentsFlag(!addStudentsFlag)
    }
  }
  const changeFlag1 = () => {
    setAddStudentsFlag(!addStudentsFlag)
  }
  
//增加学生列表
  const addStudentInfo = async(time: number) => {
    const value = await from.validateFields()
    const res = await studentCreateApi(time, {...value, avator: '', password: 123, status: 1} )
    changeFlag1()
    if(res.data.code === 200) {
      message.success('删除成功')
      fouceUpd()
      fouceUpd()
    }else{
      message.error('删除失败')
    }
  }
  //删除学生列表
  const deleteStudentList = async(id: string) => {
    const res = await studentRemoveApi(id)
    // console.log(res);
    if(res.data.code === 200) {
      message.success('删除成功')
      fouceUpd()
    }else{
      message.error('删除失败')
    }
  }
  // 编辑学生列表
  const saveStudentList = async(id:number, row:saveStudentType) => {
    const res = await studentEditApi(id, row)
    console.log(res);
    
  }

  return (
    <div className="classCon" key={fouceUpdate}>
      <ProTable<studentAllList>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口
          console.log(params, sorter, filter);
          const res = await StudentofClassApi({page,  pagesize })
          setTotal(res.data.data.total)
          return Promise.resolve({
            data: res.data.data.list,
            success: true,
          });
        }}
        editable={{
          type: 'multiple',
          onSave(key, record: saveStudentType) {
            console.log(record);
            
            saveStudentList(Date.now(), record)
          },
          onDelete(key, row) {
            deleteStudentList(row._id)
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
          pageSize: pagesize,
          // pageSizeOptions: [5, 10, 15, 20],
          showSizeChanger: true,
          onChange: (page, pagesize) => {
            setPage(page)
            setPageSize(pagesize)
            StudentofClassApi({ page, pagesize })
            console.log(page, pagesize)
          },
        }}
        dateFormatter="string"
        headerTitle="学生表格"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              // actionRef.current?.reload()
              setAddStudentsFlag(!addStudentsFlag)
            }}
            type="primary"
          >
            新建学生
          </Button>,
        ]}
      />
      { addStudentsFlag ?       
      <div className={style.addClass} ref= {studentRef} onClick={ changeFlag }>
        <div className={style.addClassInter}>
          <div className={style.addConHeader}>
            <Space>
              <span onClick={changeFlag1}>×</span>
              <p>新建学生</p>
            </Space>
          </div>
          <div className={style.addConMain}>
            <Form
              name="basic"
              form={from}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              autoComplete="off"
            >
              <Form.Item<createStudentType>
                label="姓名"
                name="username"
                rules={[{ required: true, message: '请输入姓名!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="性别"
                name="sex"
                rules={[{ required: true, message: '请输入性别!' }]}
              >
                <Select>
                  <Select.Option value='1'>男</Select.Option>
                  <Select.Option value='0'>女</Select.Option>           
                </Select>
              </Form.Item>
              <Form.Item<createStudentType>
                label="年龄"
                name="age"
                rules={[{ required: true, message: '请输入年龄!' }]}
              >
                <Input />

              </Form.Item>
              <Form.Item<createStudentType>
                label="身份证号"
                name="idCard"
                rules={[{ required: true, message: '请输入身份证号!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item<createStudentType>
                label="邮箱"
                name="email"
                rules={[{ required: true, message: '请输入邮箱!',type:'email' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="班级名称"
                name="className"
                rules={[{ required: true, message: '请输入班级名称!',type:'string' }]}
              >
                <Select>
                { uniqueArray.map( v => <Select.Option value={v._id}>{v.name}</Select.Option> )}
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
                onClick={() => addStudentInfo(Date.now())}
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
export default GroupStudents