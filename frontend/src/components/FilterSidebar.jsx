import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

const FilterSidebar = ({ allProducts, priceRange,setPriceRange, search, setSearch, category, setCategory, brand, setBrand }) => {
  const Categories = allProducts.map(p => p.category)
  const UniqueCategory = ["All", ...new Set(Categories)]

  const Brands = allProducts.map(p => p.brand)
  const UniqueBrand = ["All", ...new Set(Brands)]
  console.log(UniqueBrand);

  const handleCategoryClick = (val)=> {
    setCategory(val)
  }
  const handleBrandChange = (e)=> {
    setBrand(e.target.value)
  }
  const handleMinChange = (e)=> {
    const value = Number(e.target.value)
    if(value <= priceRange[1]) 
      setPriceRange([value, priceRange[1]])
  }
  const handleMaxChange = (e)=> {
    const value = Number(e.target.value)
    if(value >= priceRange[0]) 
      setPriceRange([priceRange[0], value])
  }
  const resetFilters = ()=> {
    setSearch("");
    setCategory("All")
    setBrand("All")
    setPriceRange([0,999999])
  }

  return (
    <div className='bg-gray-100 mt-10 p-4 rounmg
     h-max hidden md:block w-64'>
      {/* Search */}
      <Input 
      type="text" 
      placeholder="Search...." 
      className="bg-white p-2 rounded-md border-gray-400 border-2 w-full"
      value={search}
      onChange={(e)=>setSearch(e.target.value)}/>

      {/* Category */}
      <h1 className='mt-5 font-semibold text-xl'>Category</h1>
      <div className='flex flex-col gap-2 mt-3'>
        {
          UniqueCategory.map((item, index) => (
            <div key={index} className='flex items-center gap-2'>
              <input type="radio" checked={category === item} onChange={()=>handleCategoryClick(item)}/>
              <label htmlFor="">{item}</label>
            </div>
          ))
        }
      </div>

      {/* Brands */}
      <h1 className='mt-5 font-semibold text-xl'>Brands</h1>
      <select className='bg-white w-full p-2 border-gray-200 border-2 rounded-md' value={brand} onChange={handleBrandChange}>
        {
          UniqueBrand.map((item, index) => {
            return <option key={index} value={item}>{item.toUpperCase()}</option>
          })
        }
      </select>

      {/* Price Range */}
      <h1 className='mt-5 font-semibold text-xl mb-3'>Price Range</h1>
      <div className='flex flex-col gap-2'>
        <label>
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </label>
        <div className='flex gap-2 items-center'>
          <input type="number" value={priceRange[0]} onCanPlay={handleMinChange} min="0" max="5000" className='w-20 p-1 border border-gray-300 rounded'/>
          <span>-</span>
          <input type="number" value={priceRange[1]} onChange={handleMaxChange} min="0" max="999999" className='w-20 p-1 border border-gray-300 rounded'/>
        </div>
        <input type="range" value={priceRange[0]} onChange={handleMinChange} min="0" max="5000" step="100" className='w-full' />
        <input type="range" value={priceRange[1]} onChange={handleMaxChange}min="0" max="999999" step="100" className='w-full' />
      </div>
      {/* Reset Button */}
      <Button onClick={resetFilters} className="bg-pink-600 text-white mt-5 cursor-pointer w-full">Reset Filters</Button>
    </div>
  )
}

export default FilterSidebar
