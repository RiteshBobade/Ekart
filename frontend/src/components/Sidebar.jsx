import { LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react'
import React from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const Sidebar = () => {
  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className='flex overflow-x-auto no-scrollbar flex-row md:flex-col w-full md:fixed md:left-0 md:top-0 md:mt-[76px] z-40 bg-background/90 md:bg-background/80 backdrop-blur-xl border-b md:border-b-0 md:border-r border-border/50 md:w-[240px] md:h-[calc(100vh-76px)] shadow-md md:shadow-[4px_0_24px_-10px_rgba(var(--primary),0.1)]'
    >
      <div className='flex flex-row md:flex-col flex-1 p-2 md:px-5 md:pt-8 md:pb-6 gap-2 md:gap-0 md:space-y-1 overflow-y-auto no-scrollbar items-center md:items-stretch'>

        <motion.div variants={itemVariants} className="shrink-0">
          <NavLink to="/dashboard/sales" 
            className={({isActive})=> `group relative overflow-hidden flex items-center gap-2 md:gap-3 text-sm md:text-lg font-medium cursor-pointer px-4 py-3 md:p-4 rounded-full md:rounded-xl w-full transition-all duration-300 whitespace-nowrap ${isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
            {({isActive}) => (
              <>
                <LayoutDashboard className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}/>
                <span>Overview</span>
                {isActive && <motion.div layoutId="sidebar-active" className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-background rounded-r-full" />}
              </>
            )}
          </NavLink>
        </motion.div>

        <motion.div variants={itemVariants} className="shrink-0">
          <NavLink to="/dashboard/add-product" 
            className={({isActive})=> `group relative overflow-hidden flex items-center gap-2 md:gap-3 text-sm md:text-lg font-medium cursor-pointer px-4 py-3 md:p-4 rounded-full md:rounded-xl w-full transition-all duration-300 whitespace-nowrap ${isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
            {({isActive}) => (
              <>
                <PackagePlus className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}/>
                <span>Add Product</span>
                {isActive && <motion.div layoutId="sidebar-active" className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-background rounded-r-full" />}
              </>
            )}
          </NavLink>
        </motion.div>

        <motion.div variants={itemVariants} className="shrink-0">
          <NavLink to="/dashboard/products" 
            className={({isActive})=> `group relative overflow-hidden flex items-center gap-2 md:gap-3 text-sm md:text-lg font-medium cursor-pointer px-4 py-3 md:p-4 rounded-full md:rounded-xl w-full transition-all duration-300 whitespace-nowrap ${isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
            {({isActive}) => (
              <>
                <PackageSearch className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}/>
                <span>Products List</span>
                {isActive && <motion.div layoutId="sidebar-active" className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-background rounded-r-full" />}
              </>
            )}
          </NavLink>
        </motion.div>

        <motion.div variants={itemVariants} className="shrink-0">
          <NavLink to="/dashboard/users" 
            className={({isActive})=> `group relative overflow-hidden flex items-center gap-2 md:gap-3 text-sm md:text-lg font-medium cursor-pointer px-4 py-3 md:p-4 rounded-full md:rounded-xl w-full transition-all duration-300 whitespace-nowrap ${isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
            {({isActive}) => (
              <>
                <Users className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}/>
                <span>Users</span>
                {isActive && <motion.div layoutId="sidebar-active" className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-background rounded-r-full" />}
              </>
            )}
          </NavLink>
        </motion.div>

        <motion.div variants={itemVariants} className="shrink-0">
          <NavLink to="/dashboard/orders" 
            className={({isActive})=> `group relative overflow-hidden flex items-center gap-2 md:gap-3 text-sm md:text-lg font-medium cursor-pointer px-4 py-3 md:p-4 rounded-full md:rounded-xl w-full transition-all duration-300 whitespace-nowrap ${isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`}>
            {({isActive}) => (
              <>
                <FaRegEdit className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}/>
                <span>All Orders</span>
                {isActive && <motion.div layoutId="sidebar-active" className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-background rounded-r-full" />}
              </>
            )}
          </NavLink>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Sidebar
