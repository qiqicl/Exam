import React, {useEffect, useState} from 'react';
import style from './userOptions.module.scss'
import {PlusOutlined} from '@ant-design/icons';
import {Button, Table, Switch, Modal, Form, Input, Radio, message, Select, Space} from 'antd';
import {userOptionsType, userOptionsCreate} from '../../../types/api/index'
import type {SelectProps} from 'antd';
import {
    userOptionApi,
    createUserApi,
    userOptionSearchApi,
    userOptionUpdateApi,
    userOptionRoleApi
} from '../../../services/index'

interface FieldType {
    username: string;
    status: number;
    check: string;
    password: string;
}

const UserOptions: React.FC = () => {
    const [list, setList] = useState<userOptionsType[]>()
    const [visible, setVisible] = useState(false)
    const [form] = Form.useForm<userOptionsCreate>()
    const [search] = Form.useForm<FormVal>()
    const [pole] = Form.useForm<string[]>()
    const [updateId, setUpdateId] = useState<string | null>(null)
    const [visibleRole, setVisibleRole] = useState(false)
    const [options, setOptions] = useState<SelectProps['options']>([]);
    const handleChange = (value: string[]) => {
        console.log(`selected ${value}`);

    };
    const resList = (res: userOptionsType[]) => {
        const data = structuredClone(res)
        data.forEach((item: userOptionsType, i: number) => {
            item.key = i
            item.action = <div className={style.action}>
                <Button
                    type="primary"
                    size={"small"}
                    disabled={item.username === "root"}
                    onClick={() => {
                        setVisibleRole(true)
                        roleListApi()
                    }}
                >分配角色</Button>
                <Button size={"small"} disabled={item.username === "root"} onClick={() => {
                    setUpdateId(item._id)
                    setVisible(true)
                    form.setFieldsValue({
                        username: item.username,
                        status: res[i].status + '',
                        check: item.password,
                        id: item._id,
                        password: item.password
                    })
                }}>编辑</Button>
                <Button type="primary" danger size={"small"} disabled={item.username === "root"}>
                    删除
                </Button>
            </div>
            item.avator = item.avator ? <img src={item.avator as string} alt=""/> : item.username
            item.status = <Switch disabled={item.username === "root"} checked={!!item.status}
                                  onChange={(e) => onChange(e, item._id)}/>
            item.lastOnlineTime = item.lastOnlineTime ? new Date(item.lastOnlineTime).toLocaleString() : '-'
        })
        setList(data)
    }
    const listApi = async () => {
        const res = await userOptionApi()
        resList(res.data.data.list)
    }
    const roleListApi = async () => {
        const res = await userOptionRoleApi()
        console.log(res.data.data.list)
        const list: SelectProps['options'] = []
        res.data.data.list.forEach((item: { name: string }) => {
            list.push({
                label: item.name,
                value: item.name
            })
        })
        console.log(list)
        setOptions(list)
    }
    useEffect(() => {
        listApi()
    }, [])
    const onChange = (checked: boolean, id: string) => {
        console.log(checked, id);
        const status = checked ? 1 : 0
        userOptionUpdateApi({id, status}).then((res) => {
            if (res.data.code === 200) {
                message.success(res.data.msg)
                listApi()
            } else {
                message.error(res.data.msg)
            }
        })
    };
    useEffect(() => {
        if (!visibleRole) {
            pole.resetFields()
        }
    }, [visibleRole])
    useEffect(() => {
        if (!visible) {
            form.resetFields()
            setUpdateId(null)
        }
    }, [visible])
    const handleCancel = () => {
        setVisible(false)
    }
    const roleCancel = () => {
        setVisibleRole(false)
    }
    const handleOk = async () => {
        const value = await form.validateFields()
        console.log(value)
        if (!updateId) {
            const res = await createUserApi(value)
            if (res.data.code === 200) {
                message.success(res.data.msg)
                listApi()
            } else {
                message.error(res.data.msg)
            }
        } else {
            const res = await userOptionUpdateApi({...value, id: updateId})
            if (res.data.code === 200) {
                message.success(res.data.msg)
                listApi()
            } else {
                message.error(res.data.msg)
            }
        }
        setVisible(false)
    }
    const roleOk = async () => {
        const value = await pole.validateFields()
        console.log(value)
        setVisibleRole(false)
    }
    const columns = [
        {
            title: '头像',
            dataIndex: 'avator',
            key: 'avator',
        },
        {
            title: '是否禁用',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '密码',
            dataIndex: 'password',
            key: 'password',
        },
        {
            title: '最近登录',
            dataIndex: 'lastOnlineTime',
            key: 'lastOnlineTime',
        },
        {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ];
    type UserItem = {
        status: number;
        username: string;
    }
    type FormVal = Partial<UserItem>
    const searchList = async (value: FormVal) => {
        const res = await userOptionSearchApi(value)
        // console.log(res.data.data.list)
        resList(res.data.data.list)
    }
    const onFinish = (value: FormVal) => {
        // 通知父组件要搜索的内容
        searchList(value)
    }
    const reset = () => {
        search.resetFields()
        listApi()
    }
    return (
        <div className={style.UserOptions}>
            <Modal
                title="分配角色"
                open={visibleRole}
                onOk={roleOk}
                onCancel={roleCancel}
                cancelText="取消"
                okText="确定"
                className={style.modal}
            >
                <Form form={pole}>
                    <Form.Item name="pole">
                        <Space style={{width: '100%'}} direction="vertical">
                            <Select
                                mode="multiple"
                                allowClear={true}
                                style={{width: '100%'}}
                                placeholder="Please select"
                                onChange={handleChange}
                                options={options}
                                className={style.select}
                            />
                        </Space>
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 6}}>
                        <Space>
                            <Button type="primary" htmlType="submit">搜索</Button>
                            <Button onClick={reset}>重置</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
            <h3>用户管理</h3>
            <div className={style.main}>
                <div className={style.add}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={() => setVisible(true)}
                    >
                        添加用户
                    </Button>
                </div>

                <div className={style.table}>
                    <div className={style.search}>
                        <Form form={search} layout="inline"  onFinish={onFinish}>
                            <Form.Item name="username" label="账号/姓名">
                                <Input placeholder="账号/姓名"/>
                            </Form.Item>
                            <Form.Item name="status" label="启用状态">
                                <Select
                                    placeholder="选择状态"
                                    allowClear
                                    options={[
                                        {
                                            value: 1,
                                            label: '启用'
                                        },
                                        {
                                            value: 0,
                                            label: '禁用'
                                        }
                                    ]}
                                ></Select>
                            </Form.Item>
                            <Form.Item wrapperCol={{offset: 6}}>
                                <Space>
                                    <Button type="primary" htmlType="submit">搜索</Button>
                                    <Button onClick={reset}>重置</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </div>
                    <Table
                        dataSource={list}
                        columns={columns}
                        pagination={{
                            pageSize: 5,
                            showQuickJumper: true,
                        }}
                    />
                </div>
                <Modal
                    title={updateId ? '编辑' : '新增'}
                    open={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    cancelText="取消"
                    okText="确定"
                    className={style.modal}
                >
                    <Form
                        labelCol={{span: 4}}
                        wrapperCol={{span: 20}}
                        form={form}
                    >
                        <Form.Item<FieldType>
                            label="姓名"
                            name="username"
                            rules={[{required: true, message: '请输入用户名!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="密码"
                            name="password"
                            rules={[{required: true, message: '请输入密码!'}]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="确认密码"
                            name="check"
                            rules={[
                                {required: true, message: '请确认密码!'},
                                ({getFieldValue}) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('请确认两次密码一致'));
                                    },
                                })
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item<FieldType>
                            label="状态"
                            name="status"
                            rules={[{required: true, message: '请选择状态!'}]}
                        >
                            <Radio.Group>
                                <Radio value="1">启用</Radio>
                                <Radio value="0">禁用</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default UserOptions;