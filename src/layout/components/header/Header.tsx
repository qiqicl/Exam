// import React from "react"
import { useEffect, useRef, useState } from "react";
import { Layout, Avatar ,Dropdown,message} from "antd"
import { userInfoApi } from "../../../services/index"
import { useNavigate } from 'react-router-dom'
import type { MenuProps } from 'antd'
import { Link } from "react-router-dom"
import style from "./Header.module.scss"
const { Header } = Layout;

const Index = () => {
  const [avatar,setAvatar] = useState<string>("")
  const [userName,setUserName] = useState<string>("")
  const navigate = useNavigate()
  const col = useRef("#")

  const signOut = () => {
    localStorage.removeItem("token")
    navigate("/login")
    message.success("退出登录成功")
  }

  const items: MenuProps['items'] = [
    {
      label: <Link to="/userManage/personal">个人信息</Link>,
      key: '0',
    },
    {
      label: <a onClick={signOut}>退出登录</a>,
      key: '1',
    }
  ];

  const randomColor = () => {
    for (let i = 0; i < 6; i++) col.current +=parseInt((Math.random()*9).toString())
    console.log(col)
  }
  const getUserInfo = async () => {
    const res = await userInfoApi()
    console.log(res)
    setAvatar(res.data.data.avator || "")
    setUserName(res.data.data.username)
  }
  useEffect(() => {
    getUserInfo()
    randomColor()
  },[])
  return (
    <div className={style.header}>
      <Header style={{ display: "flex", alignItems: "center",justifyContent:"space-between" }}>
        <div className={style.logo}>
          <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="" />
        </div>
        <Dropdown menu={{ items }} trigger={['click']}>
            <div style={{ display: "flex", alignItems: "center"}}>
              {!avatar ?
              <Avatar size={"large"}  style={{ backgroundColor:col.current, color:"white", display: "flex", alignItems: "center" }}>{userName.slice(0,1)}</Avatar> :
              <Avatar size={"large"} src={avatar}  />
              }
              <span style={{margin:"0 20px",color:"white"}}>{userName}</span>
            </div>
        </Dropdown>
      </Header>
    </div>
  );
};

export default Index;
