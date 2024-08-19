import React, { useEffect, useState } from 'react';
import style from './group-list.module.scss'
import { classAllList, userClassType, classifyType, createClassType, editClassType } from '../../../types/api/classAndStudent'
import { classRemoveApi, calssUserApi, calssifyClassApi, calssCreateApi, calssEditApi, classFindApi, StudentInfoApi } from '../../../services/index'
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, message, Form, Input, Select } from 'antd';
import { useRef } from 'react';

const GroupList = () => {
  const [classFlag, setClassFalg] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pagesize, setPageSize] = useState(5)
  const [curLength, setCurLength] = useState<number>()
  const [classList, setClassList] = useState<classAllList[]>([])
  const [userClassList, setUserClassList] = useState<userClassType[]>([])
  const [ClassifyList, setClassifyList] = useState<classifyType[]>([])
  const [form] = Form.useForm()
  const [fouceUpdate, setfouceUpdate] = useState(0)
  const filterParams = useRef<editClassType>({} as editClassType)

  const userClassApi = async () => {
    const res = await calssUserApi()
    setUserClassList(res.data.data.list)
    console.log(userClassList);
  }
  const calssifyApi = async () => {
    const res = await calssifyClassApi()
    setClassifyList(res.data.data.list)
  }
  const calssAll = async () => {
    const res = await StudentInfoApi()
    setClassList(res.data.data.list);

  }
  useEffect(() => {
    userClassApi()
    calssifyApi()
    calssAll()
  }, [])  
  const uniqueArray: classifyType[] = ClassifyList.reduce((prev: classifyType[], current) => {
    if (!prev.some(item => item.name === current.name)) {
      prev.push(current)
    }
    return prev;
  }, []);
  const resetKeyVal = uniqueArray.reduce((prev: any, { name }: any) => {
    prev[name] = name;
    return prev;
  }, {});
  //老师名字去重并且格式化
  const teacherArray: userClassType[] = userClassList.reduce((prev: userClassType[], current) => {
    if (!prev.some(item => item.username === current.username)) {
      prev.push(current)
    }
    return prev;
  }, []);
  const resetteacherKeyVal = teacherArray.reduce((prev: any, { username }: any) => {
    prev[username] = username;
    return prev;
  }, {});
  //班级格式化
  const resetClassKeyVal = classList.reduce((prev: any, { name }: any) => {
    prev[name] = name
    return prev; 
  }, {})
  const fouceUpd = () => {
    setfouceUpdate(fouceUpdate + 1)
  }
  const changeFlag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      setClassFalg(!classFlag)
    }
  }
  const changeFlag1 = () => {
    setClassFalg(!classFlag)
  }
  //编辑班级列表
  const classSave = async (time: number) => {
    const res = await calssEditApi(time, filterParams.current)
    console.log(res);

  }
  //获取部分编辑数据
  const getPartParams = (record: classAllList) => {
    filterParams.current = {
      id: record._id,
      classify: record.classify,
      name: record.name,
      students: record.students,
      teacher: record.teacher,
    }
  }
  //删除班级列表
  const classDelete = async (id: string) => {
    const res = await classRemoveApi(id);
    console.log(res);
    if (res.data.code === 200) {
      message.success('删除成功')
      const c = await classFindApi({ page, pagesize })
      setCurLength(c.data.data.list.length)
      if (c.data.data.list.length === 0) {
        setPage(page - 1)
      }
      fouceUpd()
    } else {
      message.error(res.data.msg)
    }
  };
  //添加用户列表
  const createInfo = async (d: number) => {
    const value: createClassType = await form.validateFields()
    const res = await calssCreateApi(d, { ...value, students: [] })
    if (res.data.code === 200) {
      message.success('创建成功')
      // fouceUpd()
      const c = await classFindApi({ page, pagesize })
      setCurLength(c.data.data.list.length)
      if (c.data.data.list.length > 5) {
        setPage(page + 1)
      }
      fouceUpd()
    } else {
      message.error(res.data.msg)
    }
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
      onFilter: (value, record) => record.name === value,
      copyable: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: resetClassKeyVal,
    },
    {
      title: '老师',
      dataIndex: 'teacher',
      filters: true,
      onFilter: (value, record) => record.teacher === value,
      valueEnum: resetteacherKeyVal,
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
      filters: true,
      onFilter: (value, record) => record.classify === value,
      copyable: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: resetKeyVal
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      valueType: 'date',
      sorter: true,
      hideInSearch: true,
      editable: false
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_text, record, _, action) => [
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
  const scroll = {
    y: 340
  }
  return (
    <div key={fouceUpdate} className={style.all}>
      <div className={style.title}>
        <h2>班级列表</h2>
      </div>
      <ProTable<classAllList>
        scroll={scroll}
        className={style.classCon}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口
          const res = await classFindApi({
            page,
            pagesize,
            name: filter.name,
            teacher: filter.teacher,
            classify: filter.classify,
          })
          setTotal(res.data.data.total)
          return Promise.resolve({
            data: res.data.data.list,
            success: true,
          });
        }}
        editable={{
          type: 'multiple',
          onSave: async (_key, record: classAllList) => {
            getPartParams(record)
            classSave(Date.now())

          },
          onDelete: async (_key: any, row) => {
            classDelete(row._id)
          },
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          defaultValue: {
            option: { fixed: 'right', disable: true },
          },
          onChange(_value) {
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
          onChange: (page, pagesize) => {
            console.log(curLength);
            setPageSize(pagesize)
            if (curLength !== 0) {
              setPage(page)
            }
            console.log(page, pagesize)
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
        <div className={style.addClass} onClick={changeFlag}>
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
                    {uniqueArray.map(item => <Select.Option value={item.name} key={item._id}>{item.name}</Select.Option>)}
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