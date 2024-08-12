import {Navigate} from 'react-router-dom'
import Login from '../pages/login/Login'
import Auth from '../auth/Auth'
import Layout from '../layout/index'
import Home from '../pages/home/Home'
import CreatePaper from '../pages/paper/create-paper/Create-paper'
import PaperBank from '../pages/paper/paper-bank/Paper-bank'
import Record from "../pages/exam/record/Record";
import Create from "../pages/exam/create/Create";
import Invigilate from "../pages/exam/invigilate/Invigilate";
import GroupList from "../pages/manage-group/group-list/Group-list";
import GroupStudents from "../pages/manage-group/group-students/Group-students";
import UserOptions from "../pages/userManage/userOptions/UserOptions";
import System from "../pages/userManage/system/System";
import MenuManage from "../pages/userManage/menuManage/MenuManage";
import Personal from "../pages/userManage/personal/Personal";
import Paper from "../pages/paper/Paper";
import ManageGroup from "../pages/manage-group/Manage-group";
import Exam from "../pages/exam/Exam";
import UserManage from "../pages/userManage/UserManage";
import CreateItem from "../pages/quesion/create-item/Create-item";
import ItemBank from "../pages/quesion/item-bank/Item-bank"
const routes = [
    {
        path: '/login',
        element: <Login/>
    },
    {
        path: '/home',
        element:
            <Auth>
                <Layout>
                    <Home/>
                </Layout>
            </Auth>
    },
    {
        path: '/paper',
        element: <Paper/>,
        children: [
            {
                path:'/paper/create-paper',
                element:
                    <Auth>
                        <Layout>
                            <CreatePaper/>
                        </Layout>
                    </Auth>
            },
            {
                path:'/paper/paper-bank',
                element:
                    <Auth>
                        <Layout>
                            <PaperBank/>
                        </Layout>
                    </Auth>
            }
        ],
    },
    {
        path: '/question',
        element: <Paper/>,
        children: [
            {
                path:'/question/item-bank',
                element:
                    <Auth>
                        <Layout>
                            <ItemBank/>
                        </Layout>
                    </Auth>
            },
            {
                path:'/question/create-item',
                element:
                    <Auth>
                        <Layout>
                            <CreateItem/>
                        </Layout>
                    </Auth>
            }
        ],
    },
    {
        path: '/exam',
        element: <Exam/>,
        children: [
            {
                path:'/exam/record',
                element:
                    <Auth>
                        <Layout>
                            <Record/>
                        </Layout>
                    </Auth>
            },
            {
                path:'/exam/create',
                element:
                    <Auth>
                        <Layout>
                            <Create/>
                        </Layout>
                    </Auth>
            },
            {
                path:'/exam/invigilate',
                element:
                    <Auth>
                        <Layout>
                            <Invigilate/>
                        </Layout>
                    </Auth>
            }
        ],
    },
    {
        path: '/manage-group',
        element: <ManageGroup/>,
        children: [
            {
                path:'/manage-group/group-list',
                element:
                    <Auth>
                        <Layout>
                            <GroupList/>
                        </Layout>
                    </Auth>
            },
            {
                path:'/manage-group/group-students',
                element:
                    <Auth>
                        <Layout>
                            <GroupStudents/>
                        </Layout>
                    </Auth>
            },
        ]
    },
    {
        path: '/userManage',
        element: <UserManage/>,
        children: [
            {
                path:'/userManage/userOptions',
                element:
                    <Auth>
                        <Layout>
                            <UserOptions/>
                        </Layout>
                    </Auth>
            },
            {
                path:'/userManage/system',
                element:
                    <Auth>
                        <Layout>
                            <System/>
                        </Layout>
                    </Auth>
            },
            {
                path:'/userManage/menuManage',
                element:
                    <Auth>
                        <Layout>
                            <MenuManage/>
                        </Layout>
                    </Auth>
            },
            {
                path:'/userManage/personal',
                element:
                    <Auth>
                        <Layout>
                            <Personal/>
                        </Layout>
                    </Auth>
            },
        ]
    },
    {
        path: '/',
        element: <Navigate to="/home"/>
    }
]


export default routes