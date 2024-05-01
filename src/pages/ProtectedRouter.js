import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../security/authService';

// const LOGIN_COMPONENTS = ['/sign-in'];

function ProtectedRouter() {
  const location = useLocation();
  const isAuth = authService.isAuth();

  if(!isAuth && location.pathname !== '/') {
    authService.clear();
    return <Navigate to='/' />;
  }

  return <Outlet />;
}

export default ProtectedRouter;