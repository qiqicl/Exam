import React from "react";
import {Layout} from "antd";
import style from './Header.module.scss'
const {Header} = Layout;

const Index = () => {
    return (
        <div className={style.header}>
            <Header style={{display: "flex", alignItems: "center"}}>
                <div className={style.logo}>
                    <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt=""/>
                </div>
            </Header>
        </div>
    );
};

export default Index;
