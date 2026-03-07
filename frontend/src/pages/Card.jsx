import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import userLogo from "../assets/userLogo.jpg"
import { Button } from '@/components/ui/button'
import { ShoppingBag, ShoppingCart, Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setCart } from '@/redux/productSlice'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const Cart = () => {
  const { cart } = useSelector(store => store.product)
  const subTotal = cart?.totalPrice || 0
  const shipping = subTotal > 299 ? 0 : 10
  const tax = subTotal * 0.05 // 5% tax
  const total = subTotal + shipping + tax
  const navigate = useNavigate()
  const API = `${import.meta.env.VITE_URL}/api/v1/cart`
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(`${API}/update`, { productId, type }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleremove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: { productId }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
        toast.success('Product removed from cart')
      }

    } catch (error) {
      console.log(error)
    }
  }

  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    loadCart()
  }, [dispatch])

  return (
    <div className='pt-8 md:pt-10 pb-20 bg-background min-h-[90vh]'>
      {
        cart?.items?.length > 0 ?
          <div className='max-w-7xl mx-auto px-6'>
            <h1 className='text-4xl font-extrabold text-foreground mb-8 tracking-tight'>Shopping Cart</h1>
            <div className='flex flex-col lg:flex-row gap-8 items-start'>
              <div className='flex flex-col gap-5 flex-1 w-full'>
                {cart?.items?.map((product, index) => {
                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="glass-card rounded-2xl p-5 border border-border shadow-sm flex flex-col sm:flex-row justify-between items-center sm:items-start md:items-center gap-6"
                    >
                      <div className='flex items-center gap-6 flex-1 w-full max-w-sm'>
                        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden glass mix-blend-multiply dark:mix-blend-normal p-2">
                          <img src={product?.productId?.productImg?.[0]?.url || userLogo} alt={product?.productId?.productName} className='w-full h-full object-contain' />
                        </div>
                        <div className='flex-1'>
                          <h1 className='font-bold text-lg text-foreground line-clamp-2'>{product?.productId?.productName}</h1>
                          <p className="text-primary font-bold mt-1">₹{product.productId.productPrice}</p>
                        </div>
                      </div>

                      <div className='flex items-center justify-between sm:justify-end gap-10 w-full sm:w-auto mt-4 sm:mt-0'>
                        <div className='flex gap-3 items-center glass p-1 rounded-full border border-border'>
                          <Button 
                            onClick={() => handleUpdateQuantity(product.productId._id, 'decrease')} 
                            variant='ghost' 
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-background/50 hover:text-primary transition-colors"
                          >
                            -
                          </Button>
                          <span className="font-semibold text-foreground w-4 text-center">{product.quantity}</span>
                          <Button 
                            onClick={() => handleUpdateQuantity(product.productId._id, 'increase')} 
                            variant='ghost' 
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-background/50 hover:text-primary transition-colors"
                          >
                            +
                          </Button>
                        </div>
                        <div className="text-right min-w-[100px]">
                          <p className="text-sm text-muted-foreground mb-1">Total</p>
                          <p className="font-bold text-lg text-foreground">₹{(product?.productId?.productPrice) * (product?.quantity)}</p>
                        </div>
                        <Button 
                          onClick={() => handleremove(product?.productId?._id)} 
                          variant="ghost"
                          size="icon"
                          className='text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors'
                        >
                          <Trash2 className='w-5 h-5' />
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full lg:w-[380px] shrink-0 sticky top-28"
              >
                <Card className='glass-card border-border shadow-lg rounded-2xl'>
                  <CardHeader className="pb-2 pt-3 px-4 border-b border-border/50">
                    <CardTitle className="text-lg font-bold">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-4">
                    <div className="space-y-1 text-sm">
                      <div className='flex justify-between text-muted-foreground'>
                        <span>Subtotal ({cart?.items?.length} items)</span>
                        <span className="font-medium text-foreground">₹{subTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className='flex justify-between text-muted-foreground'>
                        <span>Shipping</span>
                        <span className="font-medium text-foreground">{shipping === 0 ? <span className="text-emerald-500 font-semibold">Free</span> : `₹${shipping}`}</span>
                      </div>
                      <div className='flex justify-between text-muted-foreground'>
                        <span>Tax (5%)</span>
                        <span className="font-medium text-foreground">₹{tax.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Separator className="bg-border/50" />
                    
                    <div className='flex justify-between font-black text-xl text-foreground'>
                      <span>Total</span>
                      <span className="text-primary">₹{total.toFixed(2)}</span>
                    </div>
                    
                    <div className='space-y-2 pt-2'>
                      <div className='flex gap-2 items-center'>
                        <Input placeholder="Promo Code" className="bg-background/50 border-input focus:ring-primary h-10 text-sm" />
                        <Button variant='secondary' className="h-10 border border-border px-3 text-sm">Apply</Button>
                      </div>
                      <Button onClick={()=>navigate('/address')} className="w-full text-base h-11 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all rounded-xl">
                        Proceed to Checkout
                      </Button>
                      <Button variant='outline' className="w-full h-10 hover:bg-secondary transition-colors group rounded-xl">
                        <Link to="/products" className="flex items-center gap-2 text-sm justify-center w-full">
                          Continue Shopping <ShoppingBag className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                    <div className='text-xs text-muted-foreground pt-2 space-y-1.5 font-medium'>
                      <p className="flex items-center gap-1.5">✓ Free Shipping on orders above ₹299</p>
                      <p className="flex items-center gap-1.5">✓ 30-days return policy</p>
                      <p className="flex items-center gap-1.5">✓ Secure checkout with SSL</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div> 
        : 
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center max-w-md mx-auto'
          >
            <div className='glass-card p-8 rounded-full border border-border bg-gradient-to-tr from-primary/10 to-transparent shadow-2xl shadow-primary/20'>
              <ShoppingCart className='w-24 h-24 text-primary' />
            </div>
            <h2 className='mt-8 text-4xl font-extrabold text-foreground tracking-tight'>Your Cart is Empty</h2>
            <p className='mt-4 text-lg text-muted-foreground leading-relaxed'>Looks like you haven't added anything to your cart yet. Discover our amazing products!</p>
            <Button onClick={() => navigate('/products')} className="mt-8 text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1">
              Start Shopping
            </Button>
          </motion.div>
      }
    </div>
  )
}

export default Cart
