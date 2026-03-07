import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='border-t bg-card text-card-foreground py-12 mt-10 transition-colors duration-300'>
      <div className='max-w-7xl mx-auto px-6 md:flex md:justify-between grid grid-cols-1 sm:grid-cols-2 gap-8'>
        
        {/* Info Section */}
        <div className='col-span-1 sm:col-span-2 md:col-span-1 mb-6 md:mb-0'>
          <Link to='/'>
            <img src='/Ekart.png' alt="Ekart Logo" className='w-32 drop-shadow-md brightness-110 dark:brightness-200' />
          </Link>
          <p className='mt-4 text-sm text-muted-foreground'>Powering Your World with the Best in Electronics.</p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p>123 Electronics St, Tech City, NY 10001</p>
            <p>Email: support@Ekart.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
        </div>

        {/* Customer Service Links */}
        <div>
          <h3 className='text-lg font-semibold tracking-tight'>Customer Service</h3>
          <ul className='mt-4 text-sm space-y-3 text-muted-foreground'>
            <li className="hover:text-primary cursor-pointer transition-colors">Contact Us</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Shipping & Returns</li>
            <li className="hover:text-primary cursor-pointer transition-colors">FAQs</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Order Tracking</li>
            <li className="hover:text-primary cursor-pointer transition-colors">Size Guide</li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className='text-lg font-semibold tracking-tight'>Follow Us</h3>
          <div className='flex space-x-4 mt-4 text-2xl text-muted-foreground'>
            <FaFacebook className="cursor-pointer hover:text-primary hover:scale-110 transition-all" />
            <FaInstagram className="cursor-pointer hover:text-primary hover:scale-110 transition-all" />
            <FaTwitterSquare className="cursor-pointer hover:text-primary hover:scale-110 transition-all" />
            <FaPinterest className="cursor-pointer hover:text-primary hover:scale-110 transition-all" />
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className='max-w-xs col-span-1 sm:col-span-2 md:col-span-1'>
          <h3 className='text-lg font-semibold tracking-tight'>Stay in the Loop</h3>
          <p className='mt-4 text-sm text-muted-foreground'>Subscribe to get special offers, free giveaways, and more.</p>
          <form action="" className='mt-4 flex shadow-sm rounded-md overflow-hidden'>
            <input 
              type="email" 
              placeholder='Your email address' 
              className='w-full p-3 bg-secondary text-secondary-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50'
            />
            <button 
              type='submit' 
              className='bg-primary text-primary-foreground px-5 hover:brightness-110 active:scale-95 transition-all font-medium'
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      

      {/* Bottom Section */}
      <div className='mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground'>
        <p>
          &copy; {new Date().getFullYear()} <span className='text-primary font-bold tracking-wider'>EKART</span>. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer