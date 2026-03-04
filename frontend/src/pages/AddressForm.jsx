import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addAddress, deleteAddress, setSelectedAddress } from '@/redux/productSlice'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const AddressForm = () => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  })

  const { addresses, selectedAddress } = useSelector((store) => store.product)

  const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleSave = () => {
    dispatch(addAddress(formData))
    setShowForm(false)
  }
  return (
    <div className='max-w-7xl mx-auto grid place-items-center p-10'>
      <div className='grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto'>
        <div className='space-y-4 p-6 bg-white'>
          {
            showForm ? (
              <>
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName" required
                    placeholder="john Doe"
                    value={formData.fullName}
                    onChange={handleChange}>
                  </Input>
                </div>
                <div>
                  <Label htmlFor="fullName">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone" required
                    placeholder="+91 8010027753"
                    value={formData.phone}
                    onChange={handleChange}>
                  </Input>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email" required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}>
                  </Input>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address" required
                    placeholder="123 Street, Area"
                    value={formData.address}
                    onChange={handleChange}>
                  </Input>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city" required
                      placeholder="Nagpur"
                      value={formData.city}
                      onChange={handleChange}>
                    </Input>
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state" required
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={handleChange}>
                    </Input>
                  </div>


                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input
                      id="zip"
                      name="zip" required
                      placeholder="442403"
                      value={formData.zip}
                      onChange={handleChange}>
                    </Input>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country" required
                      placeholder="India"
                      value={formData.country}
                      onChange={handleChange}>
                    </Input>
                  </div>


                </div>
                <Button
                  onClick={handleSave}
                  className="w-full">Save & continue</Button>

              </>
            ) : (
              <div className='space-y-4'>
                <h2 className='text-lg font-semibold'>Saved Addresses</h2>
                {
                  addresses.length > 0 ? (
                    addresses.map((addr, index) => {
                      return (
                        <div
                          onClick={() => dispatch(setSelectedAddress(index))}
                          key={index}
                          className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index
                            ? "border-pink-600 bg-pink-50"
                            : "border-gray-300"
                            }`}
                        >
                          <p className='font-medium'>{addr.fullName}</p>
                          <p>{addr.phone}</p>
                          <p>{addr.email}</p>
                          <p>
                            {addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
                          </p>
                          <button
                            onClick={(e) => dispatch(deleteAddress(index))}
                            className='absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm'>
                            Delete
                          </button>
                        </div>
                      )
                    })
                  ) : (
                    <p>No saved addresses</p>
                  )
                }
                <Button 
                onClick={()=>setShowForm(true)}
                variant='outline' className="w-full">+ Add New Address</Button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default AddressForm
