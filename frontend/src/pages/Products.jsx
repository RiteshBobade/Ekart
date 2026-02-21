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


const Products = () => {

  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const getAllProducts = async()=> {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:8000/api/v1/product/getallproducts`)
      if(res.data.success) {
        setAllProducts(res.data.products)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(()=> {
    getAllProducts()
  }, [])

  console.log(allProducts);
  

  return (
    <div className='pt-25 pb-10'>
      <div className='max-w-7xl mx-auto flex gap-7'>
        {/* sidebar */}
        <FilterSidebar allProducts={allProducts}/>
        {/* Main product section */}
        <div className='flex flex-col flex-1'>
          <div className='flex justify-end mb-4'>
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  
                  <SelectItem value="lowtohigh">Price: Low to High</SelectItem>
                  <SelectItem value="hightolow">Price: High to Low</SelectItem>
                 
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* product grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7'>
            {
              allProducts.map((product)=> {
                return <ProductCard key={product._id} product={product} loading={loading}/>
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
