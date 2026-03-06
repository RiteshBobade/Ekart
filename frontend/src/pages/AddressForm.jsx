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
        amount: total,
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
    <div className='max-w-7xl mx-auto grid place-items-center p-10'>
      <div className='grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto'>
        <div className='space-y-4 p-6 bg-white'>
          {showForm ? (
            <>
              <div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} /></div>
              <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" name="phone" required value={formData.phone} onChange={handleChange} /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" required value={formData.email} onChange={handleChange} /></div>
              <div><Label htmlFor="address">Address</Label><Input id="address" name="address" required value={formData.address} onChange={handleChange} /></div>
              <div className='grid grid-cols-2 gap-4'>
                <div><Label htmlFor="city">City</Label><Input id="city" name="city" required value={formData.city} onChange={handleChange} /></div>
                <div><Label htmlFor="state">State</Label><Input id="state" name="state" required value={formData.state} onChange={handleChange} /></div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div><Label htmlFor="zip">Zip Code</Label><Input id="zip" name="zip" required value={formData.zip} onChange={handleChange} /></div>
                <div><Label htmlFor="country">Country</Label><Input id="country" name="country" required value={formData.country} onChange={handleChange} /></div>
              </div>
              <Button onClick={handleSave} className="w-full">Save & continue</Button>
            </>
          ) : (
            <div className='space-y-4'>
              <h2 className='text-lg font-semibold'>Saved Addresses</h2>
              {addresses.map((addr, index) => (
                <div onClick={() => dispatch(setSelectedAddress(index))} key={index} className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? "border-pink-600 bg-pink-50" : "border-gray-300"}`}>
                  <p className='font-medium'>{addr.fullName}</p>
                  <p>{addr.phone}</p><p>{addr.email}</p>
                  <p>{addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}</p>
                  <button onClick={(e) => { e.stopPropagation(); dispatch(deleteAddress(index)); }} className='absolute top-2 right-2 text-red-500 text-sm'>Delete</button>
                </div>
              ))}
              <Button onClick={() => setShowForm(true)} variant='outline' className="w-full">+ Add New Address</Button>
              <Button onClick={handlePayment} disabled={selectedAddress === null} className="w-full bg-pink-600">Proceed to checkout</Button>
            </div>
          )}
        </div>
        <div>
          <Card className="w-[400px]">
            <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className='flex justify-between'><span>Subtotal ({cart.items.length}) items</span><span>₹{subTotal.toLocaleString("en-IN")}</span></div>
              <div className='flex justify-between'><span>Shipping</span><span>₹{shipping}</span></div>
              <div className='flex justify-between'><span>Tax</span><span>₹{tax}</span></div>
              <Separator />
              <div className='flex justify-between font-bold text-lg'><span>Total</span><span>₹{total}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AddressForm