import { Content } from 'antd/es/layout/layout';
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const Redirect = ({ path }: { path: string }) => {
  const location = useLocation();
  return location.pathname === '/products' ? <Navigate to={path} /> : <Outlet />;
};
export default Redirect;
