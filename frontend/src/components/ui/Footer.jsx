import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-200 py-10'>
      <div className='max-w-7xl mx-auto px-4 md:flex md:justify-between'>
        
        {/* Info Section */}
        <div className='mb-6 md:mb-0'>
          <Link to='/'>
            <img src='/Ekart.png' alt="Ekart Logo" className='w-32' />
          </Link>
          <p className='mt-2 text-sm'>Powering Your World with the Best in Electronics.</p>
          <p className='mt-2 text-sm'>123 Electronics St, Style City, NY 10001</p>
          <p className='text-sm'>Email: support@Ekart.com</p>
          <p className='text-sm'>Phone: (123) 456-7890</p>
        </div>

        {/* Customer Service Links */}
        <div className='mb-6 md:mb-0'>
          <h3 className='text-xl font-semibold'>Customer Service</h3>
          <ul className='mt-2 text-sm space-y-2'>
            <li className="hover:text-pink-500 cursor-pointer">Contact Us</li>
            <li className="hover:text-pink-500 cursor-pointer">Shipping & Returns</li>
            <li className="hover:text-pink-500 cursor-pointer">FAQs</li>
            <li className="hover:text-pink-500 cursor-pointer">Order Tracking</li>
            <li className="hover:text-pink-500 cursor-pointer">Size Guide</li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className='mb-6 md:mb-0'>
          <h3 className='text-xl font-semibold'>Follow Us</h3>
          <div className='flex space-x-4 mt-2 text-2xl'>
            <FaFacebook className="cursor-pointer hover:text-pink-500 transition-colors" />
            <FaInstagram className="cursor-pointer hover:text-pink-500 transition-colors" />
            <FaTwitterSquare className="cursor-pointer hover:text-pink-500 transition-colors" />
            <FaPinterest className="cursor-pointer hover:text-pink-500 transition-colors" />
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className='max-w-xs'>
          <h3 className='text-xl font-semibold'>Stay in the Loop</h3>
          <p className='mt-2 text-sm text-gray-400'>Subscribe to get special offers, free giveaways, and more.</p>
          <form action="" className='mt-4 flex'>
            <input 
              type="email" 
              placeholder='Your email address' 
              className='w-full p-2 bg-transparent border border-gray-600 rounded-l-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-500'
            />
            <button 
              type='submit' 
              className='bg-pink-600 text-white px-4 rounded-r-md hover:bg-pink-700 transition-colors font-medium'
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      

      {/* Bottom Section */}
      <div className='mt-8 border-t border-gray-700 pt-6 text-center text-sm'>
        <p>
          &copy; {new Date().getFullYear()} <span className='text-pink-600 font-bold'>EKart</span>. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer