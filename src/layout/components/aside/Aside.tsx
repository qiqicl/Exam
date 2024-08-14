// import React from "react"
import { useMemo ,useEffect, useState, useRef} from "react";
import { Breadcrumb,  Layout, Menu, theme } from "antd";
import { Link } from "react-router-dom";
import type { MenuProps } from "antd";
import {
  CopyOutlined,
  FormOutlined,
  TeamOutlined,
  BarsOutlined,
  DiffOutlined,
} from "@ant-design/icons";

interface Props {
  children: JSX.Element;
}
interface Menu {
  key: string;
  label: string;
  icon: JSX.Element;
  children: {
    key: string;
    label: JSX.Element;
  }[];
}

// type BreadCrumbParams = Record< 'paper' | 'paper-bank' | 'create-paper', string >
type BreadCrumbItem ={title: string | JSX.Element}[]

type MenuItem = Required<MenuProps>["items"][number];

const Aside: React.FC<Props> = (props) => {
  const pathName = useRef(location.pathname.split('/').filter(i => i))
  const [beadCrumb,setBeadCrumb] = useState< BreadCrumbItem>([
    {
      title: <Link to="/home">Home</Link>,
    }
  ])
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const items: MenuItem[] = [
    {
      key: "1",
      label: "试卷管理",
      icon: <CopyOutlined />,
      children: [
        {
          key: "/paper/paper-bank",
          label: <Link to="/paper/paper-bank">试卷库</Link>,
        },
        {
          key: "/paper/create-paper",
          label: <Link to="/paper/create-paper">创建试卷</Link>,
        },
      ],
    },
    {
      key: "2",
      label: "试题管理",
      icon: <DiffOutlined />,
      children: [
        {
          key: "/question/item-bank",
          label: <Link to="/question/item-bank">试题库</Link>,
        },
        {
          key: "/question/create-item",
          label: <Link to="/question/create-item">创建试卷</Link>,
        },
      ],
    },
    {
      key: "3",
      icon: <FormOutlined />,
      label: "考试管理",
      children: [
        {
          key: "/exam/record",
          label: <Link to="/exam/record">考试记录</Link>,
        },
        {
          key: "/exam/create",
          label: <Link to="/exam/create">创建考试</Link>,
        },
        {
          key: "/exam/invigilate",
          label: <Link to="/exam/invigilate">在线监考</Link>,
        },
      ],
    },
    {
      key: "4",
      icon: <TeamOutlined />,
      label: "班级管理",
      children: [
        {
          key: "/manage-group/group-list",
          label: <Link to="/manage-group/group-list">班级列表</Link>,
        },
        {
          key: "/manage-group/group-students",
          label: <Link to="/manage-group/group-students">学生列表</Link>,
        },
      ],
    },
    {
      key: "5",
      icon: <BarsOutlined />,
      label: "系统管理",
      children: [
        {
          key: "/userManage/userOptions",
          label: <Link to="/userManage/userOptions">用户管理</Link>,
        },
        {
          key: "/userManage/system",
          label: <Link to="/userManage/system">角色管理</Link>,
        },
        {
          key: "/userManage/menuManage",
          label: <Link to="/userManage/menuManage">权限管理</Link>,
        },
        {
          key: "/userManage/personal",
          label: <Link to="/userManage/personal">个人信息</Link>,
        },
      ],
    },
  ];


  const { Content, Sider } = Layout

  enum breadcrumbNameMap {
    'paper'= '试卷管理',
    'paper-bank'= '试卷库',
    'create-paper'= '创建试卷',
    "question"="试题管理",
    "item-bank" = "试题库",
    "create-item" = "创建试题",
    "exam" = "考试管理",
    "record" = "考试记录",
    "create" = "创建考试",
    "invigilate" = "在线监考",
    "manage-group" = "班级管理",
    "group-list" = "班级列表",
    "group-students" = "学生列表",
    "userManage" = "系统管理",
    "userOptions" = "用户管理",
    "system" = "角色管理",
    "menuManage" = "权限管理",
    "personal" = "个人信息",

  }

  type breadcrumb_item = keyof typeof breadcrumbNameMap

  const defaultOpenKeys = useMemo(() => {
    const keys: string[] = [];
    items.forEach((val) => {
      (val as Menu).children.forEach((v) => {
        if (v.key === location.pathname) {
          keys.push(val?.key as string);
        }
      });
    });
    return keys;
  }, [])

  useEffect(() => {
    setBeadCrumb(() => [{
      title: <Link to="/home">主页</Link>,
    }])
    pathName.current = location.pathname.split('/').filter(i => i)
    // console.log(location.pathname.split('/').filter(i => i))
    const breadcrumb_item_add :  BreadCrumbItem = pathName.current.map((item, index) => {
      const url = `/${pathName.current.slice(0, index + 1).join('/')}`
      return {
          title: url === location.pathname? breadcrumbNameMap[item as breadcrumb_item] :<Link to = {url}>{  breadcrumbNameMap[item as breadcrumb_item] }</Link>,
        }
    })
    if(location.pathname !== "/home") {setBeadCrumb((beadCrumb) => beadCrumb.concat(breadcrumb_item_add))}
    // console.log(beadCrumb)
  }, [location.pathname])

  return (
    <div style={{ height: "100%" }}>
      <Content
        style={{
          padding: "0 2px",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Layout
          hasSider
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            flex: "1",
            width: "100%",
          }}
        >
          <Sider
            style={{ background: colorBgContainer, height: "100%" }}
            collapsible
            theme="light"
            collapsedWidth={80}
            width={165}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={[location.pathname]}
              defaultOpenKeys={defaultOpenKeys}
              style={{ height: "100%" }}
              items={items}
            />
          </Sider>
          <Content style={{ padding: "0 24px", height: "100%", width: "100%" ,display:"flex",flexDirection:"column"}}>
            <Breadcrumb
              style={{ margin: "16px 10px" }}
              items={beadCrumb}
            ></Breadcrumb>
            <div style={{flex:1}}>
              {props.children}
            </div>
          </Content>
        </Layout>
      </Content>
    </div>
  );
};

export default Aside;
