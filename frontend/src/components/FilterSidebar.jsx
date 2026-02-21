import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'

const FilterSidebar = ({allProducts}) => {
  const Categories = allProducts.map(p => p.category)
  const UniqueCategory = ["All", ...new Set(Categories)]

  const Brands = allProducts.map(p => p.brand)
  const UniqueBrand = ["All", ...new Set(Brands)]
  console.log(UniqueBrand);
  
  return (
    <div className='bg-gray-100 mt-10 p-4 rounmg
     h-max hidden md:block w-64'>
      {/* Search */}
      <Input type="text" placeholder="Search...." className="bg-white p-2 rounded-md border-gray-400 border-2 w-full"/>

      {/* Category */}
      <h1 className='mt-5 font-semibold text-xl'>Category</h1>
      <div className='flex flex-col gap-2 mt-3'>
        {
          UniqueCategory.map((item, index)=> (
            <div key={index} className='flex items-center gap-2'>
              <input type="radio" className=""/>
              <label htmlFor="">{item}</label>
            </div>
          ))
        }
      </div>

      {/* Brands */}
      <h1 className='mt-5 font-semibold text-xl'>Brands</h1>
      <div className='flex flex-col gap-2 mt-3'>
        {
          UniqueBrand.map((item, index)=> (
            <div key={index} className='flex items-center gap-2'>
              <input type="radio" className=""/>
              <label htmlFor="">{item}</label>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default FilterSidebar
