import React from 'react'
import { CheckCircle2, ShoppingBag, Package } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const OrderSuccess = () => {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden'>
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className='glass-card rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-border/50 relative z-10'
      >
        <div className='flex justify-center mb-8'>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="bg-emerald-500/10 p-4 rounded-full"
          >
            <CheckCircle2 className='h-24 w-24 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' />
          </motion.div>
        </div>

        <h1 className='text-3xl font-extrabold text-foreground tracking-tight'>Payment Successful!</h1>

        <p className='text-muted-foreground mt-4 text-lg leading-relaxed'>
          Thank you for your purchase. Your order has been placed successfully and will be processed shortly.
        </p>

        <div className='mt-10 flex flex-col gap-4'>
          <Button
            onClick={() => navigate("/products")}
            className='w-full h-14 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1'
          >
            <ShoppingBag className="mr-2 h-5 w-5" /> Continue Shopping
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/orders")}
            className='w-full h-14 text-lg border-2 hover:bg-secondary transition-colors'
          >
            <Package className="mr-2 h-5 w-5" /> View My Orders
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default OrderSuccess
