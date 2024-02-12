import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../security/authService';

const LOGIN_COMPONENTS = ['/sign-in'];

function ProtectedRouter(props) {
  const { clearUser } = props;
  const location = useLocation();
  const isAuth = authService.isAuth();


  return <Outlet />;
}

export default ProtectedRouter;