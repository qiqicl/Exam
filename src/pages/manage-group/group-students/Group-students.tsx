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

const GroupStudents = () => {
  const [total,setTotal] = useState<number>(0)
  const [page, setPage] = useState(1)
  const [pagesize, setPageSize] = useState(5)
  const [addStudentsFlag, setAddStudentsFlag] = useState(false)
  const [studentInfoList, setStudentInfoList] = useState<classAllList[]>([])
  const [curLength,setCurLength ] = useState<number
  >()
  const actionRef = useRef<ActionType>()
  const [from] = Form.useForm()
  const filterParams = useRef<saveStudentType>({} as saveStudentType)
  const [fouceUpdate, setfouceUpdate] = useState(0)
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
  //去重
  const norepeatClassName: classAllList[] = studentInfoList.reduce((prev: classAllList[], current) => {
    if (!prev.some(item => item.name === current.name)) {
      prev.push(current)
    }
    return prev;
  }, []);
  console.log(norepeatClassName);
  // 修改成键值对形式的 对象
  const resetKeyVal = norepeatClassName.reduce((prev:any,  { name }: any) => {
    prev[name] = name;
    return prev;
  }, {});
  console.log(resetKeyVal);
  const changeFlag =( e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(e.target === e.currentTarget) {
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
      message.success('创建成功')
      fouceUpd()
    }else{
      message.error(res.data.msg)
    }
  }
  //删除学生列表
  const deleteStudentList = async(id: string) => {
    const res = await studentRemoveApi(id)
    // console.log(res);
    if(res.data.code === 200) {
      message.success('删除成功')
      const c = await StudentofClassApi({page,  pagesize })
      console.log(c.data.data.list.length);
      setCurLength(c.data.data.list.length)
        if(c.data.data.list.length === 0){
          setPage(page - 1)
          
        }
      fouceUpd()
    }else{
      message.error(res.data.msg)
    }
  }
  // 编辑学生列表
  const saveStudentList = async(id:number, row:saveStudentType) => {
    const res = await studentEditApi(id, row)
    console.log(res);
    
  }
  //筛选编辑学生列表参数
  const editStudentList = (record: studentAllList) => {
    filterParams.current = { 
       id: record._id,
       age:record.age,
       className:record.className,
       sex:record.sex,
       username:record.username
    }
    console.log(record);
  }
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
      editable: false,
    },
    {
      title: '性别',
      filters: true,
      dataIndex: 'sex',
      editable: false,
      valueType: 'select',
      valueEnum: {
        男: { text: '男' },
        女: { text: '女' }
        
      },
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
      filters: true,
      // ellipsis: true,
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
        valueType: 'select',
        filters: true,
        onFilter:(value, record) => record.className === value,
        valueEnum:resetKeyVal,
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
      editable:false
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            console.log(text);
            action?.startEditable?.(record._id);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];
  return (
    <div key={fouceUpdate}>
      <div className={style.title}>
        <h2>学生列表</h2>
      </div>
      {/* <div className={style.all}> */}
        <ProTable<studentAllList>
          className={style.classCon}
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={async (filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口
            console.log(filter);
            const res = await StudentofClassApi({
              page,
              pagesize,
              username:filter.username,
              sex: filter.sex,
              age: filter.age,
              className: filter.className
            })
            setTotal(res.data.data.total)
            return Promise.resolve({
              data: res.data.data.list,
              success: true,
            });
          }}
          editable={{
            type: 'multiple',
            onSave: async (_key, row,_originRow) => {
              editStudentList(row)
              saveStudentList(Date.now(), filterParams.current)
          },
            onDelete: async (_key, row) => {
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
            pageSizeOptions: [5, 10, 15, 20],
            showSizeChanger: true,
            onChange: async (page, pagesize) => {
              console.log(curLength);
              
              setPageSize(pagesize)
              if(curLength!==0){
                setPage(page)
              }
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
      {/* </div> */}
      { addStudentsFlag ?       
      <div className={style.addClass} onClick={ changeFlag }>
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
                  <Select.Option value={1 ? '男' : '男'}>男</Select.Option>
                  <Select.Option value={0 ? '女' : '女'}>女</Select.Option>           
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
                { norepeatClassName.map( v => <Select.Option value={v._id}>{v.name}</Select.Option> )}
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