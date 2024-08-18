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
    Tree,
    Popconfirm,
    Space, TableProps
} from 'antd';
import type {TreeProps, TreeDataNode,PopconfirmProps} from 'antd';
import {DataNode, Node} from 'antd/es/tree'
import {
    systemCreatePole,
    systemMenuListChildren,
    systemMenuListType,
    systemPoleList,
} from "../../../types/api";
import {
    systemCreateRoleApi,
    systemDelRoleApi,
    systemRoleListApi,
    systemMenuListApi,
    systemRoleApi, systemAuthorityMenuApi,
} from "../../../services";
declare module 'antd/es/tree' {
    export interface Node extends DataNode {
        permission?: string;
    }
}

const System: React.FC = () => {
    const [visible, setVisible] = useState(false)
    const [list, setList] = useState<systemPoleList[]>()
    const [form] = Form.useForm<systemCreatePole>()
    const [open, setOpen] = useState(false);
    const [treeData, setTreeData] = useState<TreeDataNode[]>()
    const [curId, setCurId] = useState<string>()
    const [curPermission, setCurPermission] = useState<string[]>()
    const [sel, setSel] = useState<string[]>([])
    const [upDate, setUpDate] = useState<number>(0)
    const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };
    const count = () => {
        setUpDate(upDate + 1)
    }
    const showDefaultDrawer = () => {
        setOpen(true);
    };
    const columns:TableProps<systemPoleList>['columns'] = [
        {
            align:'center',
            title: '角色',
            dataIndex: 'name',
            key: 'name',
        },
        {
            align:'center',
            title: '角色关键字',
            dataIndex: 'value',
            key: 'value',
        },
        {
            align:'center',
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
        },
        {
            align:'center',
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            align:'center',
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ];
    const handleOk = async () => {
        const value = await form.validateFields()
        console.log(value)
        const res = await systemCreateRoleApi(value)
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
        systemDelRoleApi(id).then((res) => {
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
                    onClick={() => {
                        showDefaultDrawer()
                        setCurId(item._id)
                    }
                    }
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
        const res = await systemRoleListApi()
        resList(res.data.data.list)
    }
    const getMenuList = async (id: string) => {
        const response = await systemRoleListApi()
        const cur = response.data.data.list?.find((item: { _id: string }) => {
            return item._id === id
        })
        const res = await systemAuthorityMenuApi()
        const select: string[] = []
        const data = res.data.data.list.map((item: systemMenuListType, index: number) => {
            return {
                title: item.name,
                key: `0-${index}`,
                disabled: item.disabled,
                permission: item._id,
                children: item.children?.map((it: systemMenuListChildren, i: number) => {
                    if (cur?.permission.some((per: string) => {
                        return per === it._id
                    })) {
                        console.log(it)
                        select.push(`0-${index}-${i}`)
                    }
                    return {
                        title: it.name,
                        key: `0-${index}-${i}`,
                        disabled: it.disabled,
                        permission: it._id
                    }
                })
            }
        })
        const s = new Set(select)
        const a = [...s]
        setSel(a)
        setTreeData(data)
        count()
    }
    const onClose = () => {
        setOpen(false);
        message.error("取消")
    }
    const onSure = async () => {
        const res = await systemRoleApi({permission: curPermission!, id: curId!})
        if (res.data.code === 200) {
            message.success(res.data.msg)
        } else {
            message.error(res.data.msg)
        }
        setOpen(false);
    }
    const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
        const list = info.checkedNodes.map((item:Node) => {
            return item.permission
        })
        setCurPermission(list as string[])
    };
    useEffect(() => {
        if (!visible) {
            form.resetFields()
        }
    }, [visible])
    useEffect(() => {
        getMenuList(curId as string)
    }, [open])
    useEffect(() => {
        getList()
    }, [])
    return (
        <div className={style.System}>
            <Drawer
                title={`Drawer`}
                placement="right"
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>取消</Button>
                        <Button type="primary" onClick={onSure}>
                            确认
                        </Button>
                    </Space>
                }
            >
                <Tree
                    key={upDate}
                    checkable
                    defaultExpandAll={true}
                    onSelect={onSelect}
                    onCheck={onCheck}
                    treeData={treeData}
                    defaultCheckedKeys={sel}
                />
            </Drawer>
            <h2>角色管理</h2>
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
                <div className={style.table}>
                    <Table
                        dataSource={list}
                        columns={columns}
                        pagination={{
                            pageSize: 10,
                            showQuickJumper: true,
                        }}
                    />
                </div>
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