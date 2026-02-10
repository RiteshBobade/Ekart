import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setUser } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { user } = useSelector(store => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async () => {
    try {
      const accesstoken = localStorage.getItem("accesstoken")
      await axios.post(`http://localhost:8000/api/v1/user/logout`, {}, {
        headers: { Authorization: `Bearer ${accesstoken}` },
        withCredentials: true 
      })
    } catch (error) {
      console.log("Local logout performed")
    } finally {
      dispatch(setUser(null)) 
      localStorage.removeItem("accesstoken") 
      toast.success("Logged out")
    }
  }

  return (

    <header className='bg-pink-50 fixed w-full z-20 border-b border-pink-200'>
      <div className='max-w-7xl mx-auto flex justify-between items-center py-3 px-4'>
        <Link to="/">
          <img src="/Ekart.png" alt="Ekart Logo" className='w-[100px]' />
        </Link>
        <nav className='flex gap-10 items-center'>
          <ul className='flex gap-7 items-center text-xl font-semibold'>
            <Link className='' to={'/'}><li>HHHome</li></Link>
            <Link to={'/products'}><li>Products</li></Link>
            {user && <Link to={'/profile'}><li>Hello, {user.firstName}</li></Link>}
          </ul>
          <Link to={'/cart'} className='relative'>
            <ShoppingCart />
            <span className='bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2 text-xs'>0</span>
          </Link>
          {user ? (
            <Button onClick={logoutHandler} className='bg-pink-600 text-white cursor-pointer'>Logout</Button>
          ) : (
            <Link to="/login">
              <Button onClick={()=>navigate('/login')} className='bg-pink-600 text-white cursor-pointer'>Login</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  
  )
}

export default Navbar