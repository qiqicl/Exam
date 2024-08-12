import { Navigate } from 'react-router-dom'
import Login from '../pages/login/Login'
import Auth from '../auth/Auth'
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
          <Home/>
        </Auth>
  },
  {
    path: '/',
    element: <Navigate to="/home" />
  }
]



export default routes