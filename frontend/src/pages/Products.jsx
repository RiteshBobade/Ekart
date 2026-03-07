import FilterSidebar from '@/components/FilterSidebar'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ProductCard from '@/components/ProductCard'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import { motion } from 'framer-motion'

const Products = () => {

  const { products } = useSelector(store => store.product)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [brand, setBrand] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 999999])
  const dispatch = useDispatch()
  const [sortOrder, setSortOrder] = useState("")

  const getAllProducts = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/product/getallproducts`)
      if (res.data.success) {
        setAllProducts(res.data.products)
        dispatch(setProducts(res.data.products))
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Error fetching products")

    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (allProducts.length === 0) return;

    let filtered = [...allProducts]

    if (search.trim() !== "") {
      filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
    }

    if (category !== "All") {
      filtered = filtered.filter(p => p.category === category)
    }

    if (brand !== "All") {
      filtered = filtered.filter(p => p.brand === brand)
    }

    filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

    if (sortOrder === "lowtohigh") {
      filtered.sort((a, b) => a.productPrice - b.productPrice)
    }
    else if (sortOrder === "hightolow") {
      filtered.sort((a, b) => b.productPrice - a.productPrice)
    }

    dispatch(setProducts(filtered))
  }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch])

  useEffect(() => {
    getAllProducts()
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  return (
    <div className='pt-8 pb-16 bg-background min-h-screen'>
      <div className='max-w-7xl mx-auto px-6'>
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">All Products</h1>
          <p className="text-muted-foreground mt-2">Browse the best electronics and gadgets.</p>
        </div>

        <div className='flex flex-col md:flex-row gap-8'>
          {/* sidebar */}
          <FilterSidebar
            allProducts={allProducts}
            search={search}
            setSearch={setSearch}
            brand={brand}
            setBrand={setBrand}
            category={category}
            setCategory={setCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange} 
          />
          
          {/* Main product section */}
          <div className='flex flex-col flex-1 pb-10'>
            <div className='flex justify-between items-center mb-6'>
              <div className="text-sm text-muted-foreground font-medium">
                Showing {Array.isArray(products) ? products.length : 0} results
              </div>
              <Select onValueChange={(value) => setSortOrder(value)}>
                <SelectTrigger className="w-[200px] border border-border bg-background focus:ring-primary shadow-sm glass-card">
                  <SelectValue placeholder="Sort by price" />
                </SelectTrigger>
                <SelectContent className="glass-card border-border">
                  <SelectGroup>
                    <SelectItem value="none">Default Sorting</SelectItem>
                    <SelectItem value="lowtohigh">Price: Low to High</SelectItem>
                    <SelectItem value="hightolow">Price: High to Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* product grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            >
              {
                Array.isArray(products) && products.length > 0 ? (
                  products
                    .filter((product) => product && product._id)
                    .map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        loading={loading}
                      />
                    ))
                ) : (
                  !loading && (
                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center glass-card rounded-2xl">
                      <p className="text-xl text-muted-foreground">No Products Found matching your filters.</p>
                      <button onClick={() => {setSearch(''); setCategory('All'); setBrand('All'); setPriceRange([0, 999999])}} className="mt-4 text-primary hover:underline">Clear Filters</button>
                    </div>
                  )
                )
              }
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
