import { Input } from '@/components/ui/input'
import { Edit, Search, Trash2, Loader2 } from 'lucide-react'
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

const AdminProduct = () => {
  const { products = [] } = useSelector(store => store.product) // ✅ default empty array
  const dispatch = useDispatch()

  const [editProduct, setEditProduct] = useState(null)
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const [loadingId, setLoadingId] = useState(null)
  const [updating, setUpdating] = useState(false)

  const accessToken = localStorage.getItem("accessToken")

  // 🔎 Filter + Sort (safe)
  const filteredProducts = useMemo(() => {
    let data = [...products.filter(Boolean)] // ✅ remove any null product

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

  // 🔥 UPDATE PRODUCT
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

  // 🔥 DELETE PRODUCT
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

  return (
    <div className='flex pl-[350px] gap-4 mt-6 py-20 pr-20 flex-col min-h-screen bg-gray-100'>

      {/* TOP BAR */}
      <div className='flex justify-between'>
        <div className='relative bg-white rounded-lg'>
          <Input
            type="text"
            placeholder="Search Product..."
            className="w-[400px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className='absolute right-3 top-1.5 text-gray-500' />
        </div>

        <Select onValueChange={(value) => setSortOrder(value)}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* PRODUCT LIST */}
      {filteredProducts.map((product) => (
        <Card key={product?._id} className="px-4 py-3 transition hover:shadow-md">
          <div className='flex items-center justify-between'>
            <div className='flex gap-4 items-center'>
              <img
                className='w-24 h-24 object-cover rounded'
                src={product?.productImg?.[0]?.url || "/placeholder.png"} // ✅ FIX
                alt={product?.productName || "product"}
              />
              <h1 className='font-bold text-base w-96 text-gray-700'>
                {product?.productName || "Unnamed Product"}
              </h1>
            </div>

            <h1 className='font-semibold text-gray-800'>
              ₹{product?.productPrice || 0}
            </h1>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3">

              {/* EDIT */}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditProduct(product)
                      setOpen(true)
                    }}
                  >
                    <Edit className="text-green-500 w-5 h-5" />
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-2xl w-[625px] max-h-[640px] overflow-y-scroll">
                  <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                      Update product details below.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col gap-3">
                    <Label>Product Name</Label>
                    <Input value={editProduct?.productName} onChange={handleChange} name="productName" />

                    <Label>Price</Label>
                    <Input type="number" value={editProduct?.productPrice} onChange={handleChange} name="productPrice" />

                    <Label>Brand</Label>
                    <Input value={editProduct?.brand} onChange={handleChange} name="brand" />

                    <Label>Category</Label>
                    <Input value={editProduct?.category} onChange={handleChange} name="category" />

                    <Label>Description</Label>
                    <Textarea value={editProduct?.productDesc} onChange={handleChange} name="productDesc" />

                    <ImageUpload productData={editProduct} setProductData={setEditProduct} />
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSave} disabled={updating}>
                      {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* DELETE */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" disabled={loadingId === product._id}>
                    {loadingId === product._id
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : <Trash2 className="text-red-500 w-5 h-5" />
                    }
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteProductHandler(product._id)}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default AdminProduct