import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { addAddress, deleteAddress, setCart, setSelectedAddress } from '@/redux/productSlice'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Trash2, CheckCircle2 } from 'lucide-react'

const AddressForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: "", phone: "", email: "", address: "", city: "", state: "", zip: "", country: ""
  })

  const { cart, addresses, selectedAddress } = useSelector((store) => store.product)
  const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSave = () => {
    dispatch(addAddress(formData))
    setShowForm(false)
  }

  const subTotal = cart.totalPrice
  const shipping = subTotal > 50 ? 0 : 10
  const tax = parseFloat((subTotal * 0.05).toFixed(2))
  const total = subTotal + shipping + tax
  const validTotal = isNaN(total) ? 0 : total

  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accessToken")
    const selectedAddr = addresses[selectedAddress]

    const nameToUse = formData.fullName || selectedAddr?.fullName || "Customer"
    const emailToUse = formData.email || selectedAddr?.email || "customer@example.com"
    const phoneToUse = formData.phone || selectedAddr?.phone || ""

    const finalPhone = phoneToUse.replace(/\D/g, "").slice(-10)

    if (finalPhone.length !== 10) {
      return toast.error("Please provide a valid 10-digit phone number.")
    }

    try {
      // Step 1: Create order on backend
      const { data } = await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/create-order`, {
        amount: validTotal,
        tax,
        shipping,
        products: cart?.items?.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity
        })),
        customerDetails: {
          customer_id: "CUST_" + Date.now(),
          customer_phone: finalPhone,
          customer_email: emailToUse,
          customer_name: nameToUse,
        }
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      if (data.success && data.payment_session_id) {
        // Step 2: Open Cashfree payment modal
        const cashfree = window.Cashfree({ mode: "sandbox" })
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_modal"
        }).then(async (result) => {
          if (result.paymentDetails) {
            try {
              // Step 3: Verify payment on backend ✅ (was missing before)
              const verifyRes = await axios.post(
                `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
                { orderId: data.order_id },
                { headers: { Authorization: `Bearer ${accessToken}` } }
              )

              if (verifyRes.data.success) {
                // Step 4: Clear cart from Redux ✅ (was missing before)
                dispatch(setCart({ items: [], totalPrice: 0 }))
                toast.success("Payment Successful!")
                navigate("/order-success")
              } else {
                toast.error("Payment verification failed. Contact support.")
              }
            } catch (verifyError) {
              console.error("Verify Error:", verifyError.response?.data || verifyError.message)
              toast.error("Payment done but verification failed. Contact support.")
            }
          } else {
            toast.error("Payment was not completed.")
          }
        })
      }
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message)
      toast.error(error.response?.data?.message || "Payment initialization failed")
    }
  }

  return (
    <div className='pt-12 md:pt-16 pb-12 min-h-screen bg-background relative overflow-hidden flex justify-center'>
      {/* Subtle background gradients for premium feel */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className='w-full max-w-6xl mx-auto px-4 z-10'>
        <h1 className='text-3xl md:text-4xl font-extrabold text-foreground mb-6 md:mb-8 tracking-tight'>Checkout</h1>
        
        <div className='flex flex-col lg:flex-row gap-10 items-start'>
          
          <div className='flex-1 w-full'>
            <AnimatePresence mode="wait">
              {showForm ? (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='space-y-4 glass-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-xl w-full'
                >
                  <h2 className='text-xl md:text-2xl font-bold mb-4 border-b border-border/50 pb-3'>Shipping Address</h2>
                  <div className="grid gap-4 md:gap-5">
                    <div>
                      <Label htmlFor="fullName" className="text-sm font-medium text-muted-foreground ml-1">Full Name</Label>
                      <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} className="bg-background/50 border-input h-10" />
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5'>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground ml-1">Phone Number</Label>
                        <Input id="phone" name="phone" required value={formData.phone} onChange={handleChange} className="bg-background/50 border-input h-10" />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-muted-foreground ml-1">Email</Label>
                        <Input id="email" name="email" required value={formData.email} onChange={handleChange} className="bg-background/50 border-input h-10" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium text-muted-foreground ml-1">Address</Label>
                      <Input id="address" name="address" required value={formData.address} onChange={handleChange} className="bg-background/50 border-input h-10" />
                    </div>
                    <div className='grid grid-cols-2 gap-4 md:gap-5'>
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium text-muted-foreground ml-1">City</Label>
                        <Input id="city" name="city" required value={formData.city} onChange={handleChange} className="bg-background/50 border-input h-10" />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-sm font-medium text-muted-foreground ml-1">State</Label>
                        <Input id="state" name="state" required value={formData.state} onChange={handleChange} className="bg-background/50 border-input h-10" />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4 md:gap-5'>
                      <div>
                        <Label htmlFor="zip" className="text-sm font-medium text-muted-foreground ml-1">Zip Code</Label>
                        <Input id="zip" name="zip" required value={formData.zip} onChange={handleChange} className="bg-background/50 border-input h-10" />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-sm font-medium text-muted-foreground ml-1">Country</Label>
                        <Input id="country" name="country" required value={formData.country} onChange={handleChange} className="bg-background/50 border-input h-10" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6 pt-2">
                    {addresses?.length > 0 && (
                      <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1 h-10 rounded-xl">Cancel</Button>
                    )}
                    <Button onClick={handleSave} className="flex-1 h-10 text-base shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all rounded-xl">Save Address</Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="saved"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='space-y-6'
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className='text-2xl font-bold'>Select Delivery Address</h2>
                  </div>
                  
                  <div className="grid gap-4">
                    {addresses.map((addr, index) => (
                      <motion.div 
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => dispatch(setSelectedAddress(index))} 
                        key={index} 
                        className={`p-5 rounded-2xl cursor-pointer relative border-2 transition-all ${selectedAddress === index ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border/50 glass hover:border-border"}`}
                      >
                        {selectedAddress === index && (
                          <div className="absolute top-5 right-5 text-primary">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex items-start gap-4">
                          <MapPin className={`w-6 h-6 mt-1 flex-shrink-0 ${selectedAddress === index ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div className="pr-12">
                            <h3 className='font-bold text-lg mb-1'>{addr.fullName}</h3>
                            <p className="text-muted-foreground text-sm mb-2">{addr.phone} • {addr.email}</p>
                            <p className="text-foreground leading-relaxed">{addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}</p>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); dispatch(deleteAddress(index)); }} 
                          className='absolute bottom-5 right-5 text-destructive/70 hover:text-destructive p-2 hover:bg-destructive/10 rounded-full transition-colors'
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  
                  <Button onClick={() => setShowForm(true)} variant='outline' className="w-full h-12 mt-4 border-dashed border-2 hover:border-primary hover:text-primary transition-colors text-base font-medium rounded-xl">
                    + Add New Address
                  </Button>
                  
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-[350px] shrink-0 xl:w-[380px] lg:sticky lg:top-24"
          >
            <Card className="glass-card border-border/50 shadow-xl overflow-hidden rounded-3xl">
              <CardHeader className="bg-secondary/30 border-b border-border/50 pb-4 pt-5 px-5">
                <CardTitle className="text-lg font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className='flex items-center justify-between text-muted-foreground text-sm'>
                  <span>Subtotal ({cart?.items?.length || 0} items)</span>
                  <span className="font-semibold text-foreground">₹{isNaN(subTotal) ? '0' : subTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className='flex items-center justify-between text-muted-foreground text-sm'>
                  <span>Shipping</span>
                  <span className="font-semibold text-foreground">{shipping === 0 ? <span className="text-emerald-500 font-bold">Free</span> : `₹${shipping}`}</span>
                </div>
                <div className='flex items-center justify-between text-muted-foreground text-sm'>
                  <span>Tax (5%)</span>
                  <span className="font-semibold text-foreground">₹{isNaN(tax) ? '0' : tax.toFixed(2)}</span>
                </div>
                
                <Separator className="bg-border/60 my-2" />
                
                <div className='flex justify-between items-center'>
                  <span className="font-bold text-lg uppercase tracking-wider text-muted-foreground">Total</span>
                  <span className="font-black text-2xl text-primary">₹{validTotal.toFixed(2)}</span>
                </div>
                
                <div className="pt-3">
                  <Button 
                    onClick={handlePayment} 
                    disabled={selectedAddress === null || showForm} 
                    className="w-full h-12 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all rounded-xl"
                  >
                    Proceed to Payment
                  </Button>
                  {selectedAddress === null && !showForm && (
                     <p className="text-xs text-destructive text-center mt-2 font-medium">Please select a delivery address to continue.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AddressForm