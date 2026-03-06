import OrderCard from '@/components/OrderCard'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const MyOrder = () => {
  const [userOrder, setuserOrder] = useState([])

  const accessToken = localStorage.getItem("accessToken")

  const getUserOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (res.data.success) {
        setuserOrder(res.data.orders)
      }

    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  useEffect(() => {
    getUserOrders()
  }, [])

  return (
    
    <>
    <OrderCard userOrder={userOrder}/>
    </>
  )
}

export default MyOrder
