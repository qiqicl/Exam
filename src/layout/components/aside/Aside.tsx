// import React from "react";
import { Breadcrumb, Layout, Menu, theme  } from "antd"
import { Link } from 'react-router-dom'
import type { MenuProps } from "antd";
import {
  CopyOutlined,
  FormOutlined,
  TeamOutlined,
  BarsOutlined,
} from '@ant-design/icons'

interface Props {
  children: JSX.Element;
}

type MenuItem = Required<MenuProps>['items'][number]

const Aside: React.FC<Props> = (props) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
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
      key: "3",
      icon: <TeamOutlined />,
      label: "班级管理",
      children: [
        {
          key: "/manage-group/group-list",
          label: <Link to="/manage-group/group-list">班级列表</Link>
        },
        {
          key: "/manage-group/group-students",
          label: <Link to="/manage-group/group-students">班级列表</Link>
        }
      ],
    },
    {
      key: "4",
      icon: <BarsOutlined />,
      label: "系统管理",
      children: [
        {
          key: "/userManage/userOptions",
          label: <Link to="/userManage/userOptions">用户管理</Link>
        },
        {
          key: "/userManage/system",
          label: <Link to="/userManage/system">角色管理</Link>
        },
        {
          key: "/userManage/menuManage",
          label: <Link to="/userManage/menuManage">权限管理</Link>
        },
        {
          key: "/userManage/personal",
          label: <Link to="/userManage/personal">个人信息</Link>
        }
      ],
    }
  ]
  const { Content, Sider } = Layout


  return <div className="aside">
          <Content style={{ padding: '0 2px' ,height:"100%",width:"100%"}}>
            <Breadcrumb style={{ margin: '16px 10px' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Layout hasSider
              style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG ,height:"100%" , width:"100%"}}
            >
              <Sider
              style={{ background: colorBgContainer,height:"100%"  }}
              collapsible
              theme="light"
              collapsedWidth={80}
              width={165}
              >
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{ height: '100%' }}
                  items={items}
                />
              </Sider>
              <Content style={{ padding: '0 24px', height: "100%" ,width:"100%"}}>{props.children}</Content>
            </Layout>
          </Content>
        </div>
};

export default Aside;
