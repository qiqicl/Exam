import React from 'react';
import {Tabs} from "antd";
import type {TabsProps} from 'antd';
import style from './Login.module.scss'

const Login: React.FC = () => {
    const onChange = (key: string) => {
        console.log(key);
    };
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Tab 1',
            children: <div className={style.head}>
                <h1>OnlineExam</h1>
                在线考试平台
            </div>,
        },
        {
            key: '2',
            label: 'Tab 2',
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
            />
        </div>
    );
};

export default Login;