import OrderCard from '@/components/OrderCard'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const MyOrder = () => {
  const [userOrder, setuserOrder] = useState([])
  const [loading, setLoading] = useState(true)

  const accessToken = localStorage.getItem("accessToken")

  const getUserOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/myorder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          withCredentials: true
        }
      )

      console.log("Fetched Orders Response:", res.data);

      if (res.data.success) {
        setuserOrder(res.data.orders || [])
      }

    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading your orders...</p>
      </div>
    )
  }

  return (
    <>
      <OrderCard userOrder={Array.isArray(userOrder) ? userOrder : []}/>
    </>
  )
}

export default MyOrder
