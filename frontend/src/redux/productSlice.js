import Products from "@/pages/Products";
import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name:'product',
  initialState:{
    Products:[],
    cart:[]
  },
  reducers:{
    setProducts:(state, action)=> {
      state.products = action.payload
    },
    setCart:(state, action)=> {
      state.cart = action.payload
    }
  }
})

export const {setProducts, setCart} = productSlice.actions
export default productSlice.reducer
