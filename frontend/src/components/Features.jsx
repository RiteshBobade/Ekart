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