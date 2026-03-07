import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './ui/Footer'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-grow pt-[76px]">
        {/* pt-[76px] ensures content doesn't overlapping with the fixed Navbar. We will adjust Navbar to match this height. */}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
