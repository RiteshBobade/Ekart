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
  const {cart} = useSelector(store=>store.product)
  const navigate = useNavigate()
  const admin = user?.role === "admin" ? true : false

  const logoutHandler = async () => {
    try {
      const accesstoken = localStorage.getItem("accesstoken")
      await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/logout`, {}, {
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
  console.log(cart)
  return (
    <header className='fixed top-0 w-full z-50 glass transition-all duration-300'>
      <div className='max-w-7xl mx-auto flex justify-between items-center py-3 px-6 relative'>
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/Ekart.png" alt="Ekart Logo" className='w-[100px] drop-shadow-md' />
        </Link>
        <nav className='flex gap-10 items-center'>
          <ul className='hidden md:flex gap-8 items-center text-lg font-medium text-muted-foreground'>
            <Link to={'/'} className='hover:text-primary transition-colors'><li>Home</li></Link>
            <Link to={'/products'} className='hover:text-primary transition-colors'><li>Products</li></Link>
            {
              user && <Link to={`/profile/${user._id}`} className='hover:text-primary transition-colors'><li>Hello, {user.firstName}</li></Link>
            }
            {
              admin && <Link to={`/dashboard/sales`} className='hover:text-primary transition-colors'><li>Dashboard</li></Link>
            }
          </ul>
          <div className="flex items-center gap-6">
            <Link to={'/cart'} className='relative hover:scale-110 transition-transform'>
              <ShoppingCart className="text-foreground hover:text-primary transition-colors" />
              <span className='bg-primary rounded-full absolute text-primary-foreground -top-2 -right-3 px-2 text-xs font-bold border-2 border-background'>
                {cart?.items?.length || 0}
              </span>
            </Link>
            {user ? (
              <Button onClick={logoutHandler} variant="default" className='shadow-lg hover:shadow-primary/25 transition-all'>Logout</Button>
            ) : (
              <Link to="/login">
                <Button onClick={() => navigate('/login')} variant="default" className='shadow-lg hover:shadow-primary/25 transition-all'>Login</Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
