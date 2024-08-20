// import React from "react"
import {useMemo, useEffect, useState, useRef} from "react";
import {Breadcrumb, Layout, Menu, theme} from "antd";
import {Link} from "react-router-dom";
import type {MenuProps} from "antd";
import {
    CopyOutlined,
    FormOutlined,
    TeamOutlined,
    BarsOutlined,
    DiffOutlined,
} from "@ant-design/icons";
import {useAppSelector} from "../../../hooks/store.ts";
// import type {examListSearchParams} from "../../../types/api";

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
type BreadCrumbItem = { title: string | JSX.Element }[]

type MenuItem = Required<MenuProps>["items"][number];

const Aside: React.FC<Props> = (props) => {
    const pathName = useRef(location.pathname.split('/').filter(i => i))
    const userInfo = useAppSelector(state => state.user.userInfo)
    const [items,setItems] = useState<MenuItem[]>()
    const [forceUpdate,setForceUpdate] = useState(0)
    const [load,setLoad] = useState(false)
    const [beadCrumb, setBeadCrumb] = useState<BreadCrumbItem>([
        {
            title: <Link to="/home">Home</Link>,
        }
    ])
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    const {Content, Sider} = Layout

    enum breadcrumbNameMap {
        'paper' = '试卷管理',
        'paper-bank' = '试卷库',
        'create-paper' = '创建试卷',
        "question" = "试题管理",
        "item-bank" = "试题库",
        "create-item" = "添加试题",
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
        "group-class" = "创建班级",
        "create-subject" = "创建科目",
    }

    type breadcrumb_item = keyof typeof breadcrumbNameMap

    const defaultOpenKeys = useMemo(() => {
        const keys: string[] = [];
        items?.forEach((val) => {
            (val as Menu).children?.forEach((v) => {
                if (v.key === location.pathname) {
                    keys.push(val?.key as string);
                }
            });
        });
        console.log(keys)
        return keys;
    }, [items])

    useEffect(() => {
        setBeadCrumb(() => [{
            title: <Link to="/home">主页</Link>,
        }])
        console.log(location.pathname)
        pathName.current = location.pathname.split('/').filter(i => i)
        // console.log(location.pathname.split('/').filter(i => i))
        const breadcrumb_item_add: BreadCrumbItem = pathName.current.map((item, index) => {
            const url = `/${pathName.current.slice(0, index + 1).join('/')}`
            return {
                title: url === location.pathname ? breadcrumbNameMap[item as breadcrumb_item] :
                    <Link to={url}>{breadcrumbNameMap[item as breadcrumb_item]}</Link>,
            }
        })
        if (location.pathname !== "/home") {
            setBeadCrumb((beadCrumb) => beadCrumb.concat(breadcrumb_item_add))
        }
        // console.log(beadCrumb)
    }, [location.pathname])
    useEffect(() => {
        const data = userInfo.permission?.map((item, index) => {
            const data:{key:string,label:JSX.Element}[] = []
            let hasParent = true
            let count = 0
            userInfo.permission.forEach(it=>{
                if(it.path?.split('/')[1]===item.path?.split('/')[1] && it.path?.indexOf('/')===it.path?.lastIndexOf('/')){
                    count += 1
                }
            })
            if(item.path?.indexOf('/')!==item.path?.lastIndexOf('/')&&count===1){
                hasParent = false
            }
            userInfo.permission.map((it)=>{
                if(item.path?.split("/")[1] === it.path?.split('/')[1] && item.path!==it.path && item.path?.indexOf('/')===item.path?.lastIndexOf('/')){
                    data.push({
                        key:it.path as string,
                        label:<Link to={it.path as string}>{it.name}</Link>,
                    })
                }
            })
            if(item.path?.indexOf('/')!==-1){
                if(item.path?.indexOf('/')===item.path?.lastIndexOf('/')){
                    return {
                        key: (index + 1) + "",
                        label: item.name,
                        icon: item.name === "试卷管理" ? <CopyOutlined/> :
                            item.name === "试题管理" ? <DiffOutlined/> :
                                item.name === "考试管理" ? <FormOutlined/> :
                                    item.name === "班级管理" ? <TeamOutlined/> : <BarsOutlined/>,
                        children:data
                    }
                }else if(hasParent){
                    return {
                        key: (index + 1) + "",
                        label: <Link to={item.path as string}>{item.name}</Link>
                    }
                }
            }
        })
        const list = data?.filter(item=>!!item)
        const res = list?.map((item,index)=>{
            return {
                ...item,
                key:(index+1)+''
            }
        })
        setItems(res)
        setForceUpdate(forceUpdate + 1)
        if(userInfo.permission){
            setLoad(true)
        }
    },[userInfo])

    return (
        <div style={{height: "100%"}} key={forceUpdate}>
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
                        style={{background: colorBgContainer, height: "100%"}}
                        collapsible
                        theme="light"
                        collapsedWidth={80}
                        width={165}
                    >
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[location.pathname]}
                            defaultOpenKeys={defaultOpenKeys}
                            style={{height: "100%"}}
                            items={items}
                            selectedKeys={[location.pathname]}
                        />
                    </Sider>
                    {load?<Content
                        style={{padding: '0', height: "100%", display: "flex", flexDirection: "column"}}>
                        <Breadcrumb
                            style={{margin: "16px 10px"}}
                            items={beadCrumb}
                        ></Breadcrumb>
                        <div style={{flex: 1,overflowY:"auto"}}>
                            {props.children}
                        </div>
                    </Content>:<div>加载中</div>}
                </Layout>
            </Content>
        </div>
    );
};

export default Aside;
