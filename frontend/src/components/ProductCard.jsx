import React from 'react'
import axios from 'axios'
import { ShoppingCart } from 'lucide-react'
import { Button } from './ui/button'
import { Skeleton } from "@/components/ui/skeleton"
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCart } from '@/redux/productSlice'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const ProductCard = ({ product, loading }) => {
  const { productImg, productPrice, productName } = product
  const accessToken = localStorage.getItem('accessToken')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const addToCart = async(productId) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/cart/add`, {productId}, {
        headers:{
          Authorization: `Bearer ${accessToken}`
        }
      })
      if(res.data.success) {
        toast.success("Product added to cart")
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to add to cart")
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='glass-card rounded-xl overflow-hidden h-max group border border-border flex flex-col'
    >
      <div className='w-full aspect-square overflow-hidden relative bg-white/5 dark:bg-black/20'>
        {
          loading ? <Skeleton className="w-full h-full rounded-none" /> 
          : 
          <>
            <img 
              onClick={()=> navigate(`/products/${product._id}`)}
              src={productImg[0]?.url} 
              alt={productName} 
              className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer mix-blend-multiply dark:mix-blend-normal' 
            />
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </>
        }
      </div>
      
      {
        loading ? (
          <div className='p-4 space-y-3'>
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
            <Skeleton className="w-full h-10 mt-2" />
          </div>
        ) : (
          <div className='p-4 flex flex-col flex-1 space-y-3 justify-between'>
            <div>
              <h1 className='font-semibold h-12 line-clamp-2 text-foreground/90 group-hover:text-primary transition-colors cursor-pointer' onClick={()=> navigate(`/products/${product._id}`)}>
                {productName}
              </h1>
              <h2 className='font-extrabold text-xl text-foreground mt-1'>₹{productPrice}</h2>
            </div>
            <Button 
              onClick={()=>addToCart(product._id)} 
              className="w-full shadow-lg hover:shadow-primary/25 transition-all group-hover:-translate-y-1 active:scale-95"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />Add to cart
            </Button>
          </div>
        )
      }
    </motion.div>
  )
}

export default ProductCard





