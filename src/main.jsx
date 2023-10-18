import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import './assets/css/output.css'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },{
    path: "/dashboard",
    element: <Dashboard/>,
  },{
    path: "/login",
    element: <Login/>,
  },{
    path: "/register",
    element: <Register/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
