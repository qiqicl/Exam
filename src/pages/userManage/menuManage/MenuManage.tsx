import React, {useEffect, useState} from 'react';
import style from './menuManage.module.scss'
import {
    Button,
    Form,
    Input,
    message,
    Drawer,
    Space,
    Table,
    InputNumber,
    Typography,
    type TableProps,
    Select, Popconfirm
} from "antd";
import type {PopconfirmProps} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import {systemMenuListType} from "../../../types/api";
import {systemAuthorityMenuApi, systemChangeMenuApi, systemCreateMenuApi, systemDelMenuApi} from "../../../services";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: 'number' | 'text';
    record: systemMenuListType;
    index: number;
}

const MenuManage: React.FC = () => {
    const [form] = Form.useForm()
    const [data, setData] = useState<systemMenuListType[]>()
    const [open, setOpen] = useState(false);
    const [rank, setRank] = useState<{ label: string, value: string }[]>()
    const [formEdit] = Form.useForm();
    const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
                                                                                    editing,
                                                                                    dataIndex,
                                                                                    title,
                                                                                    inputType,
                                                                                    record,
                                                                                    index,
                                                                                    children,
                                                                                    ...restProps
                                                                                }) => {
        const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        key={`${record}${index}`}
                        name={dataIndex}
                        style={{margin: 0}}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: systemMenuListType) => record.key === editingKey;
    const edit = (record: Partial<systemMenuListType> & { key: React.Key }) => {
        formEdit.setFieldsValue({...record});
        setEditingKey(record.key);
    };
    const confirm = async (id: string) => {
        const res = await systemDelMenuApi(id)
        if (res.data.code === 200) {
            message.success(res.data.msg)
            getList()
        } else {
            message.error(res.data.msg)
        }
    }
    const columns = [
        {
            title: '菜单名称',
            dataIndex: 'name',
            key: 'name',
            editable: true,
        },
        {
            title: '菜单路径',
            dataIndex: 'path',
            key: 'path',
            editable: true,
        },
        {
            title: '权限类型',
            dataIndex: 'isBtn',
            key: 'isBtn',
            editable: true,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            editable: true,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (_: unknown, record: systemMenuListType) => {
                const editable = isEditing(record);
                return editable ? (
                    <span className={style.edit}>
                        <Typography.Link onClick={() => save(record.key, record.id!)} style={{marginInlineEnd: 8}}>
                          保存
                        </Typography.Link>
                        <Typography.Link onClick={cancel} style={{marginInlineEnd: 8}}>
                          取消
                        </Typography.Link>
                        <Popconfirm
                            title="删除"
                            description="确认删除此用户吗?"
                            onConfirm={() => confirm(record.id!)}
                            onCancel={cancel}
                            okText="删除"
                            cancelText="取消"
                        >
                            <Button
                                type="primary"
                                danger size={"small"}
                            >
                                删除
                            </Button>
                        </Popconfirm>
                    </span>
                ) : (
                    <span>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        编辑
                        </Typography.Link>
                        <Popconfirm
                            title="删除"
                            description="确认删除此用户吗?"
                            onConfirm={() => confirm(record.id!)}
                            onCancel={cancel}
                            okText="删除"
                            cancelText="取消"
                        >
                            <Button
                                type="primary"
                                danger size={"small"}
                            >
                                删除
                            </Button>
                        </Popconfirm>

                    </span>
                );
            }
        }
    ]
    const save = async (key: React.Key, id: string) => {
        try {
            const row = await formEdit.validateFields();
            const newData = JSON.parse(JSON.stringify(data!));
            const index = newData.findIndex((item: systemMenuListType) => key === item.key);
            console.log(index, key)
            console.log(row)
            if (index > -1) {
                setEditingKey('');
                const params = {name: row.name, path: row.path, id}
                const res = await systemChangeMenuApi(params)
                console.log(res.data)
                if (res.data.code === 200) {
                    message.success(res.data.msg)
                    getList()
                } else {
                    message.error(res.data.msg)
                }
            } else {
                const params = {name: row.name, path: row.path, id}
                const res = await systemChangeMenuApi(params)
                console.log(res.data)
                if (res.data.code === 200) {
                    message.success(res.data.msg)
                    getList()
                } else {
                    message.error(res.data.msg)
                }
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const mergedColumns: TableProps<systemMenuListType>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: systemMenuListType) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const resList = (res: systemMenuListType[]) => {
        const newRank: { label: string, value: string }[] = [{
            label: '创建新的一级菜单',
            value: "0"
        }]
        const list: systemMenuListType[] = res.map((item, index) => {
            newRank.push({
                label: item.name,
                value: item._id as string
            },)
            return {
                key: `${index}`,
                name: item.name,
                path: item.path,
                createTime: item.createTime ? new Date(item.createTime).toLocaleString() : '-',
                isBtn: item.isBtn ? "按钮" : "页面",
                id: item._id,
                children: item.children?.map((it, i) => {
                    return {
                        key: `${index}-${i}`,
                        name: it.name,
                        path: it.path,
                        createTime: it.createTime ? new Date(it.createTime).toLocaleString() : '-',
                        isBtn: it.isBtn ? "按钮" : "页面",
                        id: it._id,
                    }
                })
            }
        })
        setRank(newRank)
        setData(list)
    }
    const cancel: PopconfirmProps['onCancel'] = () => {
        message.error('取消');
        setEditingKey('');
    };
    const getList = async () => {
        const res = await systemAuthorityMenuApi()
        const list = structuredClone(res.data.data.list)
        resList(list)
    }
    const onClose = () => {
        setOpen(false);
        message.error("取消")
    }
    const onFinish = async () => {
        // 通知父组件要搜索的内容
        const value = await form.validateFields()
        if (value.pid === "0") {
            value.pid = ""
        }
        console.log(value)
        const res = await systemCreateMenuApi(value)
        if (res.data.code === 200) {
            message.success(res.data.msg)
            getList()
        } else {
            message.error(res.data.msg)
        }
        setOpen(false);
    }
    useEffect(() => {
        if (!open) {
            form.resetFields()
        }
    }, [open])
    useEffect(() => {
        getList()
    }, []);
    return (
        <div className={style.MenuManage}>
            <h2>权限管理</h2>
            <div className={style.main}>
                <div className={style.table}>
                    <div className={style.add}>
                        <h3>菜单列表</h3>
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            onClick={() => setOpen(true)}
                        >
                            添加菜单
                        </Button>
                    </div>
                    <Form form={formEdit} component={false}>
                        <Table
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            columns={mergedColumns}
                            dataSource={data}
                            pagination={{
                                pageSize: 7,
                                showQuickJumper: true,
                            }}
                        />
                    </Form>

                </div>
                <Drawer
                    title={`添加菜单`}
                    placement="right"
                    onClose={onClose}
                    open={open}
                    size={"large"}
                >
                    <Form
                        labelCol={{span: 4}}
                        wrapperCol={{span: 10}}
                        form={form}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name={`pid`}
                            label={`选择菜单等级`}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入选择菜单等级!',
                                },
                            ]}
                        >
                            <Select options={rank}>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="菜单名字"
                            name="name"
                            rules={[{required: true, message: '请输入菜单名字!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name={`disabled`}
                            label={`状态`}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入状态!',
                                },
                            ]}
                        >
                            <Select
                                options={[
                                    {
                                        label: "禁用",
                                        value: true
                                    },
                                    {
                                        label: '启用',
                                        value: false
                                    }]}
                            >
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name={`isBtn`}
                            label={`权限类型`}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入权限类型!',
                                },
                            ]}
                        >
                            <Select
                                options={[
                                    {
                                        label: "页面",
                                        value: false
                                    },
                                    {
                                        label: '按钮',
                                        value: true
                                    }]}
                            >
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="路径"
                            name="path"
                            rules={[{required: true, message: '请输入路径!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item wrapperCol={{offset: 18}}>
                            <Space>
                                <Button onClick={onClose}>取消</Button>
                                <Button type="primary" htmlType="submit">确定</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Drawer>
            </div>
        </div>
    )
};

export default MenuManage;