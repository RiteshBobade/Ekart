import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Verify from './pages/verify'
import VerifyEmail from './pages/verifyEmail'
import Footer from './components/ui/Footer'
import Profile from './pages/Profile'
import Products from './pages/Products'
import Card from './pages/Card'
import Dashboard from './pages/Dashboard'
import AdminSales from './pages/admin/AdminSales'
import AdminProduct from './pages/admin/AdminProduct'
import AdminOrders from './pages/admin/AdminOrders'
import ShowUserOrders from './pages/admin/ShowUserOrders'
import AdminUsers from './pages/admin/AdminUsers'
import UserInfo from './pages/admin/UserInfo'
import ProtectedRoutes from './components/ProtectedRoutes'
import SingleProduct from './pages/SingleProduct'
import AddProduct from './pages/admin/AddProduct'


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
    element: <ProtectedRoutes ><Navbar/><Profile /></ProtectedRoutes>
  },
  {
    path: "/products",
    element: <><Navbar/><Products /></>
  },
  {
    path: "/products/:id",
    element: <><Navbar/><SingleProduct /></>
  },
  {
    path: "/cart",
    element: <ProtectedRoutes><Navbar/><Card /></ProtectedRoutes>
  },
  {
    path:"/dashboard",
    element: <ProtectedRoutes adminOnly={true}><Navbar/><Dashboard/></ProtectedRoutes>,
    children: [
      {
        path: "sales",
        element: <AdminSales/>
      },
      {
        path: "add-product",
        element: <AddProduct/>
      },
      {
        path: "products",
        element: <AdminProduct/>
      },
      {
        path: "orders",
        element: <AdminOrders/>
      },
      {
        path: "users/orders/:userId",
        element: <ShowUserOrders/>
      },
      {
        path: "users",
        element: <AdminUsers/>
      },
      {
        path: "users/:id",
        element: <UserInfo/>
      },
    ]
  }
])
const App = () => {
  return (
    <>
  <RouterProvider router={router} />
</>
  )
}

export default App