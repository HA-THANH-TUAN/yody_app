import { Content } from 'antd/es/layout/layout';
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

const Redirect = ({path}:{path:string}) => {
    const location = useLocation();
    console.log("locaion:::", location.pathname);

  return (
    (location.pathname === "/products")  ? <Navigate to={path}/> : 
    <Content className='my-3 mx-2'>
        <Outlet/>
    </Content>
    
  )
}
export default Redirect