import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Edit, Eye, Search, Mail, Box, ShieldCheck, User, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import userLogo from "../../assets/userLogo.jpg"
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

const AdminUsers = () => {
  const [users, setusers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken")
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/user/allUser`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        setusers(res.data.users)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    const accessToken = localStorage.getItem("accessToken")
    try {
      const res = await axios.delete(`${import.meta.env.VITE_URL}/api/v1/user/deleteUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        toast.success(res.data.message)
        setusers(users.filter(u => u._id !== userId))
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Failed to delete user";
      toast.error(errorMessage);
    }
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  }

  return (
    <div className='w-full max-w-7xl mx-auto'>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight'>User Management</h1>
          <p className="text-muted-foreground mt-2 text-lg">View, manage, and monitor all registered users in your system.</p>
        </div>
        
        <div className='relative w-full md:w-[400px] shrink-0'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 z-10' />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-12 h-14 bg-background/50 border-input rounded-2xl shadow-sm text-base"
            placeholder="Search by name or email..." 
          />
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      >
        <AnimatePresence>
          {filteredUsers.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="col-span-full py-20 text-center glass-card rounded-3xl border border-border/50"
             >
               <User className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
               <h3 className="text-xl font-bold mb-2">No users found</h3>
               <p className="text-muted-foreground">Try adjusting your search criteria.</p>
             </motion.div>
          ) : (
            filteredUsers.map((user, index) => (
              <motion.div 
                layout
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.9 }}
                key={user._id || index} 
                className='glass-card p-6 rounded-3xl border border-border/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full bg-gradient-to-b from-background/50 to-secondary/10'
              >
                <div className='flex items-start gap-4 mb-6'>
                  <div className="relative shrink-0">
                    <img 
                      src={user?.profilePic || userLogo} 
                      alt="" 
                      className='rounded-full w-20 h-20 object-cover border-4 border-background shadow-md' 
                    />
                    {user?.role === 'admin' && (
                      <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full shadow-lg">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-1">
                    <h2 className='font-bold text-lg truncate flex items-center gap-2'>
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1 truncate">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{user?.email}</span>
                    </div>
                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/80 text-secondary-foreground uppercase tracking-wider">
                      {user?.role || "User"}
                    </div>
                  </div>
                </div>

                <div className='flex gap-3 mt-auto pt-4 border-t border-border/50'>
                  <Button 
                    onClick={() => navigate(`/dashboard/users/${user?._id}`)} 
                    variant='outline' 
                    className="flex-1 bg-background/50 hover:bg-secondary border-border/50 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />Edit Profile
                  </Button>
                  <Button 
                    onClick={() => navigate(`/dashboard/users/orders/${user?._id}`)} 
                    className="flex-1 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform"
                  >
                    <Box className="w-4 h-4 mr-2" />View Orders
                  </Button>
                  <Button 
                    variant='outline'
                    onClick={() => handleDeleteUser(user?._id)} 
                    className="shadow-sm border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors px-3"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default AdminUsers
