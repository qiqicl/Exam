import React from 'react'
import { Navigate } from 'react-router-dom'

interface Props {
  children: JSX.Element
}

const Auth: React.FC<Props> = (props) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" />
  }
  return props.children
}

export default Auth