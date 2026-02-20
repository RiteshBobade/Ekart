import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Verify from './pages/verify'
import VerifyEmail from './pages/verifyEmail'
import Footer from './components/ui/Footer'
import Profile from './pages/Profile'

const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar /><Home /> <Footer /></>
  },
  {
    path: "/signup",
    element: <><Signup /></>
  },
  {
    path: "/login",
    element: <><Login /></>
  },
  {
    path: "/verify",
    element: <><Verify /></>
  },
  {
    path: "/verify/:token",
    element: <><VerifyEmail /></>
  },
  {
    path: "/profile/:userId",
    element: <><Navbar/><Profile /></>
  },
])
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App