import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Biodata from './pages/Biodata'
import Program from './pages/Program'
import Keluarga from './pages/Keluarga'
import Prestasi from './pages/Prestasi'
import Organisasi from './pages/Organisasi'
import Berkas from './pages/Berkas'
import TestSchoolarship from './pages/Schoolarship/TestSchoolarship'
import Scholarship from './pages/Scholarship'
import './input.css'

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
    path: "/programstudi",
    element: <Program/>,
  },{
    path: "/keluarga",
    element: <Keluarga/>,
  },{
    path: "/prestasi",
    element: <Prestasi/>,
  },{
    path: "/organisasi",
    element: <Organisasi/>,
  },{
    path: "/berkas",
    element: <Berkas/>,
  },{
    path: "/scholarship",
    element: <Scholarship/>,
  },{
    path: "/seleksi-beasiswa",
    element: <TestSchoolarship/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
