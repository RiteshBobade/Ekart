

// import React from 'react'

// import { Link } from 'react-router-dom'

// import { ShoppingCart } from 'lucide-react'

// import { Button } from './ui/button'

// import { useDispatch, useSelector } from 'react-redux'





// const Navbar = () => {

//   const {user} = useSelector(store=>store.user)

//   const accesstoken = localStorage.getItem("accesstoken")

//   const dispatch = useDispatch()



//   const logoutHandler = () => async () => {

//     try {

//       const res = await axios.post(`http://localhost:8000/api/v1/user/logout`,{},{

//         headers:{

//           Authorization:`Bearer ${accesstoken}`

//         }

//       })

//       if(res.data.success)

//       {

//         dispatch(setUser(null))

//         toast.success(res.data.message)

//       }

//     } catch (error) {

//       console.log(error)

//     }

//   }

//   return (

//     <header className='bg-pink-50 fixed w-full z-20 border-b border-pink-200'>



//       <div className='max-w-7xl mx-auto flex justify-between items-center py-3'>

//         {/* Logo */}

//         <div>

//           <img src="/Ekart.png" alt="Ekart Logo" className='w-[100px]' />

//         </div>

//         {/* Navigation Links */}

//         <nav className='flex gap-10 justify-between items-center'>

//           <ul className='flex gap-7 items-center text-xl font-semibold'>

//             <Link to={'/'}><li>Home</li></Link>

//             <Link to={'/products'}><li>Products</li></Link>

//             {

//               user && <Link to={'/profile'}><li>Hello, {user.firstName}</li></Link>

//             }



//           </ul>

//           <Link to={'/cart'} className='relative'>

//             <ShoppingCart />

//             <span className='bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2'>0</span>

//           </Link>

//           {

//             user ? <Button onClick={logoutHandler} className='bg-pink-600 text-white cursor-pointer'>Logout</Button> : <Button className='bg-gradient-to-tl from-blue-600 to-purple-600 text-white cursor-pointer'>Login</Button>

//           }



//         </nav>

//       </div>



//     </header>

//   )

// }



// export default Navbar

























// import React from 'react'
// import { Link, useNavigate } from 'react-router-dom' // Added useNavigate
// import { ShoppingCart } from 'lucide-react'
// import { Button } from './ui/button'
// import { useDispatch, useSelector } from 'react-redux'
// import axios from 'axios' // Added this
// import { toast } from 'sonner' // Added this
// import { setUser } from '../redux/userSlice' // Added this

// const Navbar = () => {
//   const { user } = useSelector(store => store.user)
//   const dispatch = useDispatch()
//   const navigate = useNavigate() // Initialize for redirect

//   const logoutHandler = async () => {
//     try {
//       const accesstoken = localStorage.getItem("accesstoken")
//       const res = await axios.post(`http://localhost:8000/api/v1/user/logout`, {}, {
//         headers: {
//           Authorization: `Bearer ${accesstoken}`
//         },
//         withCredentials: true // Important for session handling
//       })

//       if (res.data.success) {
//         dispatch(setUser(null)) // Clears Redux state immediately
//         localStorage.removeItem("accesstoken") // Clears local storage
//         toast.success(res.data.message)
//         navigate("/login") // Sends user back to login page
//       }
//     } catch (error) {
//       console.log(error)
//       toast.error(error.response?.data?.message || "Logout failed")
//     }
//   }

//   return (
//     <header className='bg-pink-50 fixed w-full z-20 border-b border-pink-200'>
//       <div className='max-w-7xl mx-auto flex justify-between items-center py-3 px-4'>
//         <div>
//           <img src="/Ekart.png" alt="Ekart Logo" className='w-[100px]' />
//         </div>
//         <nav className='flex gap-10 items-center'>
//           <ul className='flex gap-7 items-center text-xl font-semibold'>
//             <Link to={'/'}><li>Home</li></Link>
//             <Link to={'/products'}><li>Products</li></Link>
//             {user && <Link to={'/profile'}><li>Hello, {user.firstName}</li></Link>}
//           </ul>
//           <Link to={'/cart'} className='relative'>
//             <ShoppingCart />
//             <span className='bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2 text-xs'>0</span>
//           </Link>
//           {user ? (
//             <Button onClick={logoutHandler} className='bg-pink-600 text-white cursor-pointer'>
//               Logout
//             </Button>
//           ) : (
//             <Link to="/login">
//               <Button className='bg-gradient-to-tl from-blue-600 to-purple-600 text-white cursor-pointer'>
//                 Login
//               </Button>
//             </Link>
//           )}
//         </nav>
//       </div>
//     </header>
//   )
// }

// export default Navbar



























// import React from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { ShoppingCart } from 'lucide-react'
// import { Button } from './ui/button'
// import { useDispatch, useSelector } from 'react-redux'
// import axios from 'axios'
// import { toast } from 'sonner'
// import { setUser } from '../redux/userSlice'

// const Navbar = () => {
//   const { user } = useSelector(store => store.user)
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const logoutHandler = async () => {
//     try {
//       const accesstoken = localStorage.getItem("accesstoken")
      
//       // We still try to tell the backend to close the session
//       const res = await axios.post(`http://localhost:8000/api/v1/user/logout`, {}, {
//         headers: {
//           Authorization: `Bearer ${accesstoken}`
//         },
//         withCredentials: true 
//       })

//       if (res.data.success) {
//         toast.success(res.data.message)
//       }
//     } catch (error) {
//       console.log("Backend logout failed, but clearing local state anyway.")
//       // We don't show "Invalid credentials" toast here because we want to finish the logout locally
//     } finally {
//       // ALWAYS run these lines to fix the UI
//       dispatch(setUser(null)) 
//       localStorage.removeItem("accesstoken") 
//       navigate("/login")
//     }
//   }

//   return (
//     <header className='bg-pink-50 fixed w-full z-20 border-b border-pink-200'>
//       <div className='max-w-7xl mx-auto flex justify-between items-center py-3 px-4'>
//         <div>
//           <img src="/Ekart.png" alt="Ekart Logo" className='w-[100px]' />
//         </div>
//         <nav className='flex gap-10 items-center'>
//           <ul className='flex gap-7 items-center text-xl font-semibold'>
//             <Link to={'/'}><li>Home</li></Link>
//             <Link to={'/products'}><li>Products</li></Link>
//             {user && <Link to={'/profile'}><li>Hello, {user.firstName}</li></Link>}
//           </ul>
//           <Link to={'/cart'} className='relative'>
//             <ShoppingCart />
//             <span className='bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2 text-xs'>0</span>
//           </Link>
//           {user ? (
//             <Button onClick={logoutHandler} className='bg-pink-600 text-white cursor-pointer hover:bg-pink-700'>
//               Logout
//             </Button>
//           ) : (
//             <Link to="/login">
//               <Button className='bg-pink-600 text-white cursor-pointer'>Login</Button>
//             </Link>
//           )}
//         </nav>
//       </div>
//     </header>
//   )
// }

// export default Navbar
















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
            <Link to={'/'}><li>Home</li></Link>
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