import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

const FilterSidebar = ({ allProducts, priceRange,setPriceRange, search, setSearch, category, setCategory, brand, setBrand }) => {
  const Categories = allProducts.map(p => p.category)
  const UniqueCategory = ["All", ...new Set(Categories)]

  const Brands = allProducts.map(p => p.brand)
  const UniqueBrand = ["All", ...new Set(Brands)]

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
    <aside className='glass-card mt-2 p-6 rounded-2xl h-max flex flex-col w-full md:w-72 relative md:sticky md:top-24 shrink-0 shadow-lg border-border mb-8 md:mb-0'>
      {/* Search */}
      <div className="mb-6">
        <h2 className='font-bold text-lg mb-3 tracking-tight'>Search</h2>
        <Input 
          type="text" 
          placeholder="Search products..." 
          className="bg-background/50 border-input w-full focus:ring-primary shadow-sm"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
      </div>

      {/* Category */}
      <div className="mb-6">
        <h2 className='font-bold text-lg mb-3 tracking-tight'>Category</h2>
        <div className='flex flex-col gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar'>
          {
            UniqueCategory.map((item, index) => (
              <Label key={index} className='flex items-center gap-3 cursor-pointer group'>
                <input 
                  type="radio" 
                  className="accent-primary w-4 h-4 cursor-pointer"
                  checked={category === item} 
                  onChange={()=>handleCategoryClick(item)}
                />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
              </Label>
            ))
          }
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h2 className='font-bold text-lg mb-3 tracking-tight'>Brands</h2>
        <select 
          className='w-full p-2.5 bg-background/50 border border-input rounded-md text-foreground focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm' 
          value={brand} 
          onChange={handleBrandChange}
        >
          {
            UniqueBrand.map((item, index) => {
              return <option key={index} value={item} className="bg-background text-foreground">{item.toUpperCase()}</option>
            })
          }
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h2 className='font-bold text-lg mb-3 tracking-tight'>Price Range</h2>
        <div className='flex flex-col gap-4'>
          <div className="text-sm font-medium text-primary">
            ₹{priceRange[0]} - ₹{priceRange[1]}
          </div>
          <div className='flex gap-3 items-center'>
            <Input 
              type="number" 
              value={priceRange[0]} 
              onChange={handleMinChange} 
              min="0" 
              max="10000" 
              className='w-full bg-background/50'
            />
            <span className="text-muted-foreground">-</span>
            <Input 
              type="number" 
              value={priceRange[1]} 
              onChange={handleMaxChange} 
              min="0" 
              max="999999" 
              className='w-full bg-background/50'
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <Button 
        onClick={resetFilters} 
        variant="outline"
        className="mt-2 w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm cursor-pointer"
      >
        Reset Filters
      </Button>
    </aside>
  )
}

export default FilterSidebar
