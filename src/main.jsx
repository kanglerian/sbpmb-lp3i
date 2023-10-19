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
import Biodata from './pages/Biodata'
import Keluarga from './pages/Keluarga'

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
  },{
    path: "/biodata",
    element: <Biodata/>,
  },{
    path: "/keluarga",
    element: <Keluarga/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
