// import React from 'react'
// import { Button } from './ui/button'

// const Hero = () => {
//   return (
//     <section className='bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16'>
//       <div className='max-w-7xl mx-auto px-4'>
//         <div className='grid md:grid-cols-2 gap-8 items-center'>
//           <div>
//             <h1 className='text-4xl md:text-6xl font-bold mb-4'>Latest Electronics at Best Prices</h1>
//             <p className='text-xl mb-6 text-blue-100'>Discover cutting-edge technology with unbeatable deals on smartphones, laptops and moreand discounts.</p>
//             <div className='flex flex-col sm:flex-row gap-4'>
//               <Button className='bg-white text-blue-600 hover:bg-gray-100'>Shop Now</Button>
//               <Button variant='outline' className='border-white text-white hover:bg-white hover:text-blue-600 bg-transparent'>View Deals</Button>
//             </div>
//           </div>
//           <div className='relative'>
//             <img src="/" alt="" />
//           </div>
//         </div>
//       </div>

//     </section>
//   )
// }

// export default Hero
import React from 'react'
import { Button } from './ui/button'

const Hero = () => {
  return (
    /* Updated to a soft, premium gradient to make the product pop */
    <section className='bg-gradient-to-br from-pink-400 via-white to-pink-400 text-gray-800 py-16 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid md:grid-cols-2 gap-8 items-center'>
          <div>
            <h1 className='text-4xl md:text-6xl font-bold mb-4 tracking-tight text-gray-900'>
              Latest Electronics at Best Prices
            </h1>
            <p className='text-xl mb-6 text-gray-600'>
              Discover cutting-edge technology with unbeatable deals on smartphones, laptops, and exclusive discounts.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              {/* Button colors updated to match the new soft theme */}
              <Button className='bg-pink-600 text-white hover:bg-pink-700 font-semibold px-8 py-6 text-lg'>
                Shop Now
              </Button>
              <Button 
                variant='outline' 
                className='border-pink-600 text-pink-600 hover:bg-pink-50 bg-transparent px-8 py-6 text-lg'
              >
                View Deals
              </Button>
            </div>
          </div>
          
          <div className='relative flex justify-center items-center'>
            {/* 1. h-64 md:h-80: Controls height so it stays within the section.
               2. drop-shadow-2xl: Puts the shadow around the phone shape, not the image box.
               3. transition/hover: Keeps your cool hover effect.
            */}
            <img 
              src="Ekart-hero1.png" 
              alt="Electronics Showcase" 
              className="mt-20 h-64 md:h-[450px] w-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500 ease-out"
            />
            
            {/* Optional: Subtle background glow behind the phone */}
            <div className="absolute -z-10 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero