import React from 'react'
import { Button } from './ui/button'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className='relative bg-background text-foreground py-10 md:py-16 min-h-[calc(100vh-76px)] flex items-center overflow-hidden'>
      {/* Background glowing effects */}
      <div className="absolute top-0 right-0 -z-10 w-[50vh] h-[50vh] bg-primary/20 rounded-full blur-[120px] opacity-60 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-[40vh] h-[40vh] bg-accent/20 rounded-full blur-[100px] opacity-60 mix-blend-screen pointer-events-none" />

      <div className='max-w-7xl mx-auto px-6 w-full'>
        <div className='grid lg:grid-cols-2 gap-8 md:gap-12 items-center'>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6 md:space-y-8 z-10"
          >
            <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-tight'>
              Next-Gen Tech, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-500">
                Unbeatable Deals
              </span>
            </h1>
            <p className='text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg'>
              Discover cutting-edge technology with exclusive discounts on smartphones, laptops, and premium gear. Upgrade your world today.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 pt-2 md:pt-4'>
              <Link to="/products">
                <Button className='w-full sm:w-auto px-8 py-6 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/50 hover:scale-105 transition-all'>
                  Shop Now
                </Button>
              </Link>
              <Link to="/products">
                <Button 
                  variant='outline' 
                  className='w-full sm:w-auto px-8 py-6 text-lg rounded-full border-2 hover:bg-secondary hover:scale-105 transition-all'
                >
                  View Deals
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className='relative flex justify-center items-center z-10'
          >
            <img 
              src="Ekart-hero1.png" 
              alt="Electronics Showcase" 
              className="mt-6 md:mt-10 h-[30vh] sm:h-[40vh] lg:h-[450px] w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-110 hover:-translate-y-4 transition-all duration-500 ease-out"
            />
            
            {/* Inner glow behind the image */}
            <div className="absolute -z-10 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-tr from-primary/30 to-transparent rounded-full blur-3xl opacity-50"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero