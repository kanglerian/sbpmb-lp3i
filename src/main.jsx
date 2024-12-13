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
import TestSchoolarship from './pages/Scholarship/TestScholarship'
import Scholarship from './pages/Scholarship'
import Pribadi from './pages/Pribadi'
import Orangtua from './pages/Orangtua'
import './input.css'
import Prodi from './pages/Prodi'
import Berkas from './pages/Berkas'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },{
    path: "/login",
    element: <Login/>,
  },{
    path: "/register",
    element: <Register/>,
  },{
    path: "/dashboard",
    element: <Dashboard/>,
  },{
    path: "/pribadi",
    element: <Pribadi/>,
  },{
    path: "/orangtua",
    element: <Orangtua/>,
  },{
    path: "/programstudi",
    element: <Prodi/>,
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
