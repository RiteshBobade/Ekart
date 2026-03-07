import React, { useState } from 'react'
import Cart from '../Card'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import ProductDesc from '@/components/ProductDesc'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import Products from '../Products'
import { Loader2, PlusCircle, LayoutDashboard, Tag, IndianRupee, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

const AddProduct = () => {
  const dispatch = useDispatch()
  const {products} = useSelector(store=>store.product)
  const [loading, setLoading] = useState(false)
  const accessToken = localStorage.getItem("accessToken")
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: 0,
    productDesc: "",
    productImg: [],
    brand: "",
    category: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const submithandler = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("productName", productData.productName)
    formData.append("productPrice", productData.productPrice)
    formData.append("productDesc", productData.productDesc)
    formData.append("category", productData.category)
    formData.append("brand", productData.brand)

    if (productData.productImg.length === 0) {
      toast.error("Please select atleast 1 image")
      return
    }

    productData.productImg.forEach((img) => {
      formData.append("files", img)
    })

    try {
      setLoading(true)
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/product/add`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        dispatch(setProducts([...products, res.data.Product]))
        toast.success(res.data.message)
        // Set Product Data back to empty state after success
        setProductData({
          productName: "",
          productPrice: 0,
          productDesc: "",
          productImg: [],
          brand: "",
          category: ""
        })
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add product");
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='w-full max-w-5xl mx-auto'
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground mt-2 text-lg">Create a new product listing in your catalog.</p>
      </div>

      <Card className="glass-card border-border/50 shadow-2xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-secondary/30 border-b border-border/50 pb-6 pt-8 px-8 flex flex-row items-center gap-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <PlusCircle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Product Information</CardTitle>
            <CardDescription className="text-base mt-1 text-muted-foreground">Fill in the details below to add a new item.</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          <div className='flex flex-col lg:flex-row gap-10 items-start'>
            {/* Left Column - Details */}
            <div className='flex-1 space-y-6 w-full'>
              <div className='space-y-2'>
                <Label className="text-sm font-medium text-muted-foreground ml-1">Product Name</Label>
                <div className="relative">
                  <LayoutDashboard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={productData.productName}
                    onChange={handleChange}
                    type="text"
                    name="productName"
                    placeholder="e.g., iPhone 15 Pro Max"
                    className="pl-10 h-12 bg-background/50 border-input"
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Label className="text-sm font-medium text-muted-foreground ml-1">Price (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={productData.productPrice}
                      onChange={handleChange}
                      type="number"
                      name="productPrice"
                      placeholder="99999"
                      className="pl-10 h-12 bg-background/50 border-input font-mono"
                      required
                    />
                  </div>
                </div>
                
                <div className='space-y-2'>
                  <Label className="text-sm font-medium text-muted-foreground ml-1">Category</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={productData.category}
                      onChange={handleChange}
                      type="text"
                      name="category"
                      placeholder="e.g., Smartphones"
                      className="pl-10 h-12 bg-background/50 border-input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className='space-y-2'>
                <Label className="text-sm font-medium text-muted-foreground ml-1">Brand</Label>
                <div className="relative">
                  <LayoutDashboard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={productData.brand}
                    onChange={handleChange}
                    type="text"
                    name="brand"
                    placeholder="e.g., Apple"
                    className="pl-10 h-12 bg-background/50 border-input"
                    required
                  />
                </div>
              </div>

              <div className='space-y-2 pt-2'>
                <Label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Description
                </Label>
                <Textarea
                  value={productData.productDesc}
                  onChange={handleChange}
                  name="productDesc"
                  placeholder="Enter a comprehensive description of the product..."
                  className="min-h-[150px] bg-background/50 border-input resize-y p-4 text-base"
                  required
                />
              </div>
            </div>

            {/* Right Column - Images */}
            <div className='w-full lg:w-[400px] shrink-0 space-y-4'>
              <Label className="text-lg font-bold text-foreground">Product Images</Label>
              <p className="text-sm text-muted-foreground mb-4">Upload high quality images of your product. The first image will be used as the cover.</p>
              
              <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50 border-dashed">
                <ImageUpload productData={productData} setProductData={setProductData} />
              </div>
            </div>
          </div>
        </CardContent>
        
        <div className="bg-secondary/30 p-8 border-t border-border/50 mt-4">
          <Button
            disabled={loading}
            onClick={submithandler}
            className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all" 
            type="submit"
          >
            {loading ? (
              <span className='flex gap-2 items-center'><Loader2 className='animate-spin w-5 h-5'/> Creating Product...</span>
            ) : "Publish Product"}
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

export default AddProduct
