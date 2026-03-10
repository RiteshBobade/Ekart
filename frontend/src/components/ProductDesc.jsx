import React from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCart } from '@/redux/productSlice';
import { ShoppingCart, Tag, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDesc = ({ product }) => {
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()
  const addTocart = async (productId)=> {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/cart/add`, {productId}, {
        headers: {
          Authorization:`Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        toast.success('Product added to cart')
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to add product to cart')
    }
  }

  if (!product) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className='flex flex-col gap-6 w-full max-w-xl'
    >
      <div>
        <div className="flex gap-3 mb-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
            {product.category}
          </span>
          <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
            {product.brand}
          </span>
        </div>
        <h1 className='font-extrabold text-3xl text-foreground tracking-tight leading-tight'>{product.productName}</h1>
      </div>
      
      <div className="flex items-end gap-4">
        <h2 className='text-primary font-black text-4xl tracking-tighter'>₹{product.productPrice}</h2>
        <p className="text-muted-foreground mb-2 line-through decoration-muted-foreground/50">₹{(product.productPrice * 1.2).toFixed(2)}</p>
      </div>

      <div className="bg-secondary/30 rounded-xl p-5 border border-border">
        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" /> Product Details
        </h3>
        <p className='text-muted-foreground leading-relaxed whitespace-pre-wrap'>{product.productDesc}</p>
      </div>

      <div className='flex flex-wrap gap-4 items-center mt-2 pt-6 border-t border-border'>
        <div className="flex items-center gap-3">
          <p className='text-foreground font-semibold'>Quantity:</p>
          <Input type="number" className="w-20 bg-background/50 border-input text-foreground font-medium text-center shadow-sm" defaultValue={1} min={1}/>
        </div>
        <Button 
          className="flex-1 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all group py-6 text-lg rounded-xl" 
          onClick={()=>addTocart(product._id)}
        >
          <ShoppingCart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductDesc


