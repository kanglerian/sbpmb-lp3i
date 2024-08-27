import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Pribadi from './pages/Pribadi'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Prestasi from './pages/Prestasi'
import Organisasi from './pages/Organisasi'
import Berkas from './pages/Berkas'
import TestSchoolarship from './pages/Schoolarship/TestSchoolarship'
import Scholarship from './pages/Scholarship'
import './input.css'
import Orangtua from './pages/Orangtua'
import Prodi from './pages/Prodi'

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
    path: "/pribadi",
    element: <Pribadi/>,
  },{
    path: "/programstudi",
    element: <Prodi/>,
  },{
    path: "/orangtua",
    element: <Orangtua/>,
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
