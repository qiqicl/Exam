import React, {useEffect, useState} from 'react';
import style from './system.module.scss'
import {PlusOutlined} from '@ant-design/icons';
import {
    Button,
    Table,
    Modal,
    Drawer,
    Form,
    Input,
    message,
    Space,
    Popconfirm,
    type PopconfirmProps
} from 'antd';
import type {DrawerProps} from 'antd';
import {systemCreatePole, systemPoleList} from "../../../types/api";
import {systemCreatePoleApi, systemDelPoleApi, systemMenuListApi} from "../../../services";


const System: React.FC = () => {
    const [visible, setVisible] = useState(false)
    const [list, setList] = useState<systemPoleList[]>()
    const [form] = Form.useForm<systemCreatePole>()
    const [open, setOpen] = useState(false);
    const [size, setSize] = useState<DrawerProps['size']>();

    const showDefaultDrawer = () => {
        setSize('default');
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const columns = [
        {
            title: '角色',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '角色关键字',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ];
    const handleOk = async () => {
        const value = await form.validateFields()
        console.log(value)
        const res = await systemCreatePoleApi(value)
        if (res.data.code === 200) {
            message.success(res.data.msg);
            getList()
        } else {
            message.error(res.data.msg);
        }
        setVisible(false)
    }
    const handleCancel = () => {
        setVisible(false)
        message.error('取消');
    }
    const confirm = (id: string) => {
        systemDelPoleApi(id).then((res) => {
            if (res.data.code === 200) {
                message.success('删除成功');
                getList()
            }
        })
    };
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
        message.error('取消');
    };
    const resList = (res: systemPoleList[]) => {
        const data = structuredClone(res)
        data.forEach((item, i: number) => {
            item.key = i
            item.action = <div className={style.action}>
                <Button
                    type="primary"
                    size={"small"}
                    disabled={item.disabled}
                    onClick={showDefaultDrawer}
                >分配角色</Button>
                <Popconfirm
                    title="删除"
                    description="确认删除此用户吗?"
                    onConfirm={() => confirm(item._id)}
                    onCancel={cancel}
                    okText="删除"
                    cancelText="取消"
                >
                    <Button
                        type="primary"
                        danger size={"small"}
                        disabled={item.disabled}
                    >
                        删除
                    </Button>
                </Popconfirm>
            </div>
            item.createTime = item.createTime ? new Date(item.createTime).toLocaleString() : '-'
        })
        setList(data)
    }
    const getList = async () => {
        const res = await systemMenuListApi()
        console.log(res.data.data.list)
        resList(res.data.data.list)
    }
    useEffect(() => {
        if (!visible) {
            form.resetFields()
        }
    }, [visible])
    useEffect(() => {
        getList()
    }, [])
    return (
        <div className={style.System}>
            <Drawer
                title={`${size} Drawer`}
                placement="right"
                size={size}
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={onClose}>
                            OK
                        </Button>
                    </Space>
                }
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
            <h3>角色管理</h3>
            <div className={style.main}>
                <div className={style.add}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined/>}
                        onClick={() => setVisible(true)}
                    >
                        新增角色
                    </Button>
                </div>
                <Table
                    dataSource={list}
                    columns={columns}
                    pagination={{
                        pageSize: 10,
                        showQuickJumper: true,
                    }}
                />
                <Modal
                    title='新增角色'
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
                        <Form.Item
                            label="角色名称"
                            name="name"
                            rules={[{required: true, message: '请输入角色名称!'}]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="角色关键字"
                            name="value"
                            rules={[{required: true, message: '请输入角色关键字!'}]}
                        >
                            <Input/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default System;