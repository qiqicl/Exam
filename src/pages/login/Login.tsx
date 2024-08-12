import React, {useEffect, useState} from 'react';
import { Button, Form, Input,Tabs,message } from 'antd';
import type {TabsProps} from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import style from './Login.module.scss'
import {captchaApi,loginApi,loginStudentApi} from '../../services/index'
import {LoginParams} from '../../types/api/index'
import {useNavigate} from "react-router-dom";
const Login: React.FC = () => {
    const [codeUrl,setCodeUrl] = useState("")
    const [key,setKey] = useState("1")
    const navigate = useNavigate()
    const onChange = (key: string) => {
        console.log(key);
        setKey(key)
    };
    const loginStudent = async (values:LoginParams) => {
        const res = await loginStudentApi(values)
        if(res.data.data?.token){
            message.success(res.data.msg)
            navigate('/home')
        }else{
            message.error(res.data.msg)
        }


    }
    const login = async (values:LoginParams) => {
        const res = await loginApi(values)
        if(res.data.data?.token){
            message.success(res.data.msg)
            navigate('/home')
        }else{
            message.error(res.data.msg)
        }
    }
    const onFinish = (values: LoginParams) => {
        if(key === "1"){
            loginStudent(values)
        }else {
            login(values)
        }
    };
    const code = async () => {
        const res = await captchaApi()
        console.log(res)
        setCodeUrl(res.data.data.code)
    }
    useEffect(()=>{
        code()
    },[])
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: '我是学生',
            children: <div className={style.head}>
                <h1>OnlineExam</h1>
                在线考试平台
            </div>,
        },
        {
            key: '2',
            label: '我是老师',
            children: <div className={style.head}>
                <h1>OnlineExamAdmin</h1>
                考试平台管理后台
            </div>,
        }
    ];
    return (
        <div className={style.login}>
            <Tabs
                defaultActiveKey="1"
                items={items}
                onChange={onChange}
                centered={true}
                tabPosition={"bottom"}
                style={{ width: 400 }}
            />
            <Form
                name="login"
                initialValues={{ remember: true }}
                style={{ width: 400 }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名！' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="输入用户名" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码！' }]}
                >
                    <Input prefix={<LockOutlined />} type="password" placeholder="输入密码" />
                </Form.Item>
                <Form.Item
                    name="code"
                    rules={[{ required: true, message: '请输入验证码！' }]}
                >
                    <div className={style.code}>
                        <Input type="code" placeholder="输入验证码" />
                        <img src={codeUrl} alt="" onClick={code}/>
                    </div>
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;