import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-background relative overflow-hidden'>
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className='sticky top-[76px] md:static z-40 bg-background/95 backdrop-blur-md'>
        <Sidebar/>
      </div>
      
      <div className='flex-1 md:ml-[240px] relative z-10 transition-all duration-300 min-h-screen'>
        <div className="p-4 md:p-8 pt-6 md:pt-8 w-full max-w-7xl mx-auto h-full">
          <Outlet/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
