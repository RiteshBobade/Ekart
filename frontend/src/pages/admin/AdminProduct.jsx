import { Input } from '@/components/ui/input'
import { Edit, Search, Trash2, Loader2, PackageSearch } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ImageUpload'
import axios from 'axios'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productSlice'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

const AdminProduct = () => {
  const { products = [] } = useSelector(store => store.product)
  const dispatch = useDispatch()

  const [editProduct, setEditProduct] = useState(null)
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const [loadingId, setLoadingId] = useState(null)
  const [updating, setUpdating] = useState(false)

  const accessToken = localStorage.getItem("accessToken")

  const filteredProducts = useMemo(() => {
    let data = [...products.filter(Boolean)]

    if (searchTerm) {
      data = data.filter(p =>
        p?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (sortOrder === "lowToHigh") {
      data.sort((a, b) => (a?.productPrice || 0) - (b?.productPrice || 0))
    }

    if (sortOrder === "highToLow") {
      data.sort((a, b) => (b?.productPrice || 0) - (a?.productPrice || 0))
    }

    return data
  }, [products, searchTerm, sortOrder])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditProduct(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!editProduct) return

    setUpdating(true)

    const formData = new FormData()
    formData.append("productName", editProduct.productName || "")
    formData.append("productDesc", editProduct.productDesc || "")
    formData.append("productPrice", editProduct.productPrice || 0)
    formData.append("category", editProduct.category || "")
    formData.append("brand", editProduct.brand || "")

    const existingImages = (editProduct.productImg || [])
      .filter((img) => img && !(img instanceof File) && img.public_id)
      .map((img) => img.public_id)

    formData.append("existingImages", JSON.stringify(existingImages))

      ; (editProduct.productImg || [])
        .filter((img) => img instanceof File)
        .forEach((file) => formData.append("files", file))

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/v1/product/update/${editProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      if (res.data.success) {
        toast.success("Product Updated Successfully")
        const updatedProducts = products.map((p) =>
          p?._id === editProduct._id ? res.data.product : p
        )
        dispatch(setProducts(updatedProducts))
        setOpen(false)
      }
    } catch (error) {
      toast.error("Update failed")
    } finally {
      setUpdating(false)
    }
  }

  const deleteProductHandler = async (productId) => {
    setLoadingId(productId)
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_URL}/api/v1/product/delete/${productId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        const updatedProducts = products.filter(
          (product) => product?._id !== productId
        )
        dispatch(setProducts(updatedProducts))
      }
    } catch (error) {
      toast.error("Delete failed")
    } finally {
      setLoadingId(null)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 }
  }

  return (
    <div className='w-full max-w-7xl mx-auto'>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight'>Product Inventory</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage everything in your store catalog.</p>
        </div>
        
        <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0'>
          <div className='relative w-full sm:w-[350px]'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 z-10' />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-12 h-12 bg-background/50 border-input rounded-xl shadow-sm"
              placeholder="Search products..." 
            />
          </div>

          <Select onValueChange={(value) => setSortOrder(value)}>
            <SelectTrigger className="w-full sm:w-[200px] h-12 bg-background/50 border-input shadow-sm rounded-xl">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>
            <SelectContent className="glass-card">
              <SelectGroup>
                <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                <SelectItem value="highToLow">Price: High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div 
         variants={containerVariants}
         initial="hidden"
         animate="visible"
         className='grid gap-4'
      >
        <AnimatePresence>
          {filteredProducts.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="col-span-full py-24 text-center glass-card rounded-3xl border border-border/50"
             >
               <PackageSearch className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
               <h3 className="text-xl font-bold mb-2">No products found</h3>
               <p className="text-muted-foreground">Try adjusting your search or filters.</p>
             </motion.div>
          ) : (
            filteredProducts.map((product) => (
              <motion.div 
                layout
                variants={itemVariants}
                exit={{ opacity: 0, scale: 0.95 }}
                key={product?._id}
              >
                <Card className="glass-card p-4 rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-all group overflow-hidden">
                  <div className='flex flex-col sm:flex-row items-center justify-between gap-6'>
                    <div className='flex items-center gap-6 w-full sm:w-auto'>
                      <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-xl bg-secondary">
                         <img
                          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                          src={product?.productImg?.[0]?.url || "/placeholder.png"} 
                          alt={product?.productName || "product"}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className='font-bold text-lg text-foreground truncate max-w-[300px] sm:max-w-xs md:max-w-md'>
                          {product?.productName || "Unnamed Product"}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs bg-secondary/80 text-secondary-foreground font-medium">
                            {product?.category || "Uncategorized"}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{product?.brand}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-border/50 sm:border-0">
                      <div className='font-black text-xl text-primary shrink-0'>
                        ₹{product?.productPrice?.toLocaleString('en-IN') || 0}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Dialog open={open && editProduct?._id === product?._id} onOpenChange={(val) => {
                             setOpen(val);
                             if(!val) setEditProduct(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="bg-background/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors"
                              onClick={() => {
                                setEditProduct(product)
                                setOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-2xl glass-card border flex flex-col h-[90vh] sm:h-auto max-h-[85vh] p-0 overflow-hidden rounded-3xl">
                            <DialogHeader className="p-6 pb-4 border-b border-border/50 shrink-0 bg-background/80 backdrop-blur-md z-10">
                              <DialogTitle className="text-2xl font-bold">Edit Product</DialogTitle>
                              <DialogDescription>
                                Update product details and media below.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground ml-1">Product Name</Label>
                                <Input className="bg-background/50 border-input h-12" value={editProduct?.productName || ''} onChange={handleChange} name="productName" />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-muted-foreground ml-1">Price (₹)</Label>
                                  <Input className="bg-background/50 border-input h-12 font-mono" type="number" value={editProduct?.productPrice || ''} onChange={handleChange} name="productPrice" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-muted-foreground ml-1">Brand</Label>
                                  <Input className="bg-background/50 border-input h-12" value={editProduct?.brand || ''} onChange={handleChange} name="brand" />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground ml-1">Category</Label>
                                <Input className="bg-background/50 border-input h-12" value={editProduct?.category || ''} onChange={handleChange} name="category" />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground ml-1">Description</Label>
                                <Textarea className="bg-background/50 border-input min-h-[120px] resize-y p-3" value={editProduct?.productDesc || ''} onChange={handleChange} name="productDesc" />
                              </div>

                              <div className="space-y-2 bg-secondary/20 p-4 rounded-xl border border-border/50">
                                <Label className="text-sm font-medium text-muted-foreground ml-1 mb-2 block">Product Media</Label>
                                <ImageUpload productData={editProduct} setProductData={setEditProduct} />
                              </div>
                            </div>

                            <DialogFooter className="p-6 pt-4 border-t border-border/50 shrink-0 bg-background/80 backdrop-blur-md z-10 flex flex-col sm:flex-row gap-3">
                              <DialogClose asChild>
                                <Button className="w-full sm:w-auto h-12" variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button className="w-full sm:w-auto h-12 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-transform" onClick={handleSave} disabled={updating}>
                                {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Changes
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              disabled={loadingId === product._id}
                              className="bg-background/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
                            >
                              {loadingId === product._id
                                ? <Loader2 className="w-4 h-4 animate-spin text-destructive" />
                                : <Trash2 className="w-4 h-4 text-destructive" />
                              }
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent className="glass-card border-border/50 rounded-3xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-base text-muted-foreground">
                                This will permanently delete <span className="font-semibold text-foreground">{product?.productName}</span> and remove its data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4 gap-2">
                              <AlertDialogCancel className="h-11">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="h-11 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20"
                                onClick={() => deleteProductHandler(product._id)}
                              >
                                Delete Product
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default AdminProduct