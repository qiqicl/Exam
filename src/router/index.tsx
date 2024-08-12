import { Navigate } from 'react-router-dom'
import Login from '../pages/login/Login'
import Auth from '../auth/Auth'
import Layout  from '../layout/index'
import Home from '../pages/home/Home'
const routes = [
  {
    path: '/login',
    element: <Login />
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
    path: '/',
    element: <Navigate to="/home" />
  }
]



export default routes