import OrderCard from '@/components/OrderCard'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, PackageSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ShowUserOrders = () => {
  const params = useParams()
  const navigate = useNavigate()
  const [userOrder, setuserOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const getUserOrders = async ()=> {
    const accessToken = localStorage.getItem("accessToken")
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/user-order/${params.userId}`, {
        headers: { Authorization:`Bearer ${accessToken}` }
      })
      if(res.data.success) {
        setuserOrder(res.data.orders)
      }
    } catch (error) {
      console.error("Failed to fetch user orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    getUserOrders()
  }, [])

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] pl-[300px]'>
        <Loader2 className='w-10 h-10 animate-spin text-primary mb-4' />
        <p className='text-muted-foreground font-medium'>Loading User Orders...</p>
      </div>
    )
  }

  return (
    <div className='w-full max-w-7xl mx-auto pl-[50px] lg:pl-0'>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-10"
      >
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="bg-background/50 hover:bg-secondary border-border/50 rounded-xl"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Button>
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight'>User Orders</h1>
          <p className="text-muted-foreground mt-1 text-sm">Viewing order history for specific user.</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {!userOrder || userOrder.length === 0 ? (
          <div className="glass-card rounded-3xl border border-border/50 shadow-xl flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-secondary/50 p-6 rounded-full mb-6">
              <PackageSearch className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No orders found</h2>
            <p className="text-muted-foreground max-w-sm">This user hasn't placed any orders yet.</p>
          </div>
        ) : (
          <OrderCard userOrder={userOrder} />
        )}
      </motion.div>
    </div>
  )
}

export default ShowUserOrders
