// import React from 'react'

// const Features = () => {
//   return (
//     <section className='py-12 bg-muted/50'>
//       <div className='max-w-7xl mx-auto px-4'>

//       </div>

//     </section>
//   )
// }

// export default Features

// import { Headphones, Shield, Truck } from 'lucide-react'
// import React from 'react'

// const Features = () => {
//   return (
//     <section className="py-12 bg-muted/50">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="grid md:grid-cols-3 gap-8">
          
//           {/* Free Shipping Feature */}
//           <div className="flex items-center space-x-4">
//             <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
//               <Truck className="h-6 w-6 text-blue-600" />
//             </div>
//             <div>
//               <h3 className="font-semibold">Free Shipping</h3>
//               <p className="text-muted-foreground">On orders over $50</p>
//             </div>
//           </div>

//           {/* Secure Payment Feature */}
//           <div className="flex items-center space-x-4">
//             <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
//               <Shield className="h-6 w-6 text-green-600" />
//             </div>
//             <div>
//               <h3 className="font-semibold">Secure Payment</h3>
//               <p className="text-muted-foreground">100% secure transactions</p>
//             </div>
//           </div>

//           {/* 24/7 Support Feature */}
//           <div className="flex items-center space-x-4">
//             <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
//               <Headphones className="h-6 w-6 text-purple-600" />
//             </div>
//             <div>
//               <h3 className="font-semibold">24/7 Support</h3>
//               <p className="text-muted-foreground">Always here to help</p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   )
// }

// export default Features



// import { Headphones, Shield, Truck } from 'lucide-react'
// import React from 'react'

// const Features = () => {
//   return (
//     <section className="py-16 bg-muted/50">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Added 'items-center' to the grid to ensure vertical alignment */}
//         <div className="grid md:grid-cols-3 gap-12 text-center">
          
//           {/* Free Shipping Feature */}
//           <div className="flex flex-col items-center justify-center space-y-4">
//             {/* Increased h-16 w-16 for a larger circle */}
//             <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
//               {/* Increased icon size to h-10 w-10 */}
//               <Truck className="h-10 w-10 text-blue-600" />
//             </div>
//             <div>
//               {/* Increased text size to text-2xl and text-lg */}
//               <h3 className="font-bold text-2xl">Free Shipping</h3>
//               <p className="text-muted-foreground text-lg">On orders over $50</p>
//             </div>
//           </div>

//           {/* Secure Payment Feature */}
//           <div className="flex flex-col items-center justify-center space-y-4">
//             <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
//               <Shield className="h-10 w-10 text-green-600" />
//             </div>
//             <div>
//               <h3 className="font-bold text-2xl">Secure Payment</h3>
//               <p className="text-muted-foreground text-lg">100% secure transactions</p>
//             </div>
//           </div>

//           {/* 24/7 Support Feature */}
//           <div className="flex flex-col items-center justify-center space-y-4">
//             <div className="h-20 w-20 bg-purple-100 rounded-full flex items-center justify-center">
//               <Headphones className="h-10 w-10 text-purple-600" />
//             </div>
//             <div>
//               <h3 className="font-bold text-2xl">24/7 Support</h3>
//               <p className="text-muted-foreground text-lg">Always here to help</p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   )
// }

// export default Features





import { Headphones, Shield, Truck } from 'lucide-react'
import React from 'react'

const Features = () => {
  return (
    <section className="py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* 'text-center' ensures all text is aligned horizontally center */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          
          {/* Free Shipping Feature */}
          <div className="flex flex-col items-center justify-center space-y-3">
            {/* Medium Circle: h-16 w-16 */}
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center transition-transform hover:scale-110">
              {/* Medium Icon: h-8 w-8 */}
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-xl">Free Shipping</h3>
              <p className="text-muted-foreground text-sm">On orders over $50</p>
            </div>
          </div>

          {/* Secure Payment Feature */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center transition-transform hover:scale-110">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-xl">Secure Payment</h3>
              <p className="text-muted-foreground text-sm">100% secure transactions</p>
            </div>
          </div>

          {/* 24/7 Support Feature */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center transition-transform hover:scale-110">
              <Headphones className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-xl">24/7 Support</h3>
              <p className="text-muted-foreground text-sm">Always here to help</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Features