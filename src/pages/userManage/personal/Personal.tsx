import React, {useEffect, useState} from 'react';
import style from "./personal.module.scss";
import {message, Upload, Descriptions, Button, Modal, Form, Input, InputNumber, Select} from 'antd';
import ImgCrop from 'antd-img-crop';
import type {GetProp, UploadProps, UploadFile,DescriptionsProps} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {systemAvatarApi, systemUpdateInfoApi, userInfoApi} from "../../../services";
import {systemUpdateInfoType} from "../../../types/api";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const Personal: React.FC = () => {
    const [avatar,setAvatar] = useState<string>()
    const [userInfo,setUserInfo] = useState<systemUpdateInfoType>()
    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false)
    const onPreview = async (file: UploadFile) => {
        console.log(file)
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as FileType);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: '用户名称',
            children: userInfo?.username?userInfo?.username:'-',
        },
        {
            key: '2',
            label: '性别',
            children: userInfo?.sex?userInfo?.sex:'-',
        },
        {
            key: '3',
            label: '年龄',
            children: userInfo?.age?userInfo?.age:'-',
        },
        {
            key: '4',
            label: '邮箱地址',
            children: userInfo?.email?userInfo?.email:'-',
        },

    ];
    const handleCancel = () => {
        setVisible(false)
        message.error('取消');
    }
    const handleOk = async () => {
        const value = await form.validateFields()
        console.log(value)
        const res = await systemUpdateInfoApi(value)
        if (res.data.code === 200) {
            message.success(res.data.msg)
            upDate()
        } else {
            message.error(res.data.msg)
        }
        setVisible(false)
    }
    const upDate = () => {
        userInfoApi().then(res=>{
            setAvatar(res.data.data.avator)
            setUserInfo(res.data.data)
        })
    }
    useEffect(() => {
        upDate()
    }, [])
    useEffect(() => {
        if (!visible) {
            form.resetFields()
        }
    }, [visible])
    return (
        <div className={style.Personal}>
            <h2>个人信息</h2>
            <div className={style.main}>
                <div className={style.table}>
                    <ImgCrop
                        rotationSlider
                    >
                        <Upload
                            action={avatar}
                            name="avatar"
                            listType="picture-card"
                            showUploadList={false}
                            onPreview={onPreview}
                            customRequest={async (options) => {
                                console.log(options.file)
                                const data = new FormData()
                                data.append("avatar",options.file)
                                systemAvatarApi(data).then(res=>{
                                    console.log(res.data.data.url)
                                    systemUpdateInfoApi({avator:res.data.data.url}).then((res)=>{
                                        if (res.data.code === 200) {
                                            message.success(res.data.msg)
                                            userInfoApi().then(res=>{
                                                setAvatar(res.data.data.avator)
                                            })
                                        } else {
                                            message.error(res.data.msg)
                                        }
                                    })
                                })
                            }}
                        >
                            {avatar?<img src={avatar} alt="avatar" style={{width: '100%'}}/>:<PlusOutlined/>}
                        </Upload>
                    </ImgCrop>
                    <div className={style.descriptions}>
                        <Descriptions bordered items={items} />
                    </div>
                    <div className={style.edit}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            onClick={() => {
                                setVisible(true)
                                form.setFieldsValue({
                                    username: userInfo?.username,
                                    sex:userInfo?.sex,
                                    age:userInfo?.age,
                                    email:userInfo?.email
                                })
                            }}
                        >
                            点击编辑
                        </Button>
                    </div>
                </div>
            </div>
            <Modal
                title="编辑"
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
                        label="姓名"
                        name="username"
                        rules={[{message: '请输入姓名!'}]}
                    >
                        <Input placeholder="输入姓名"/>
                    </Form.Item>
                    <Form.Item name="sex" label="性别">
                        <Select
                            placeholder="选择性别"
                            allowClear
                            options={[
                                {
                                    value: "男",
                                    label: '男'
                                },
                                {
                                    value: '女',
                                    label: '女'
                                }
                            ]}
                        ></Select>
                    </Form.Item>
                    <Form.Item name="age" label="年龄" rules={[{ type: 'number'}]}>
                        <InputNumber placeholder="输入年龄"/>
                    </Form.Item>
                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[{message: '请输入邮箱!'}]}
                    >
                        <Input placeholder="输入邮箱"/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
};
export default Personal;