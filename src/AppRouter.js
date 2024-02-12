import React from 'react';
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import Login from './pages/Login';
import ProtectedRouter from './pages/ProtectedRouter';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';

const router = createHashRouter(
  createRoutesFromElements(
    <Route path='/' element={<ProtectedRouter />}>
      <Route path='/' index element={<Login />} />
      <Route path='/inventory' index element={<Inventory />} />
      <Route path='/orders' index element={<Orders />} />
    </Route>
  )
);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
