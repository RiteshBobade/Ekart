import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'

const AdminSales = () => {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    sales: [] // matches backend response
  })

  const fetchStats = async () => {
    try {

      const accessToken = localStorage.getItem("accessToken")

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (res.data.success) {
        setStats(res.data)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className='pt-25 pl-[350px] bg-gray-100 py-20 pr-20 mx-auto px-4'>

      <div className='p-6 grid gap-6 lg:grid-cols-4'>

        {/* Total Users */}
        <Card className="bg-pink-500 text-white">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalUsers}
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card className="bg-pink-500 text-white">
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalProducts}
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="bg-pink-500 text-white">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.totalOrders}
          </CardContent>
        </Card>

        {/* Total Sales */}
        <Card className="bg-pink-500 text-white">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ₹{stats.totalSales.toFixed(2)}
          </CardContent>
        </Card>

        {/* Sales Chart */}
        {/* Sales Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales (Last 30 Days)</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="w-full h-[350px]">

              <ResponsiveContainer width="100%" height="100%">
  <AreaChart data={stats.sales || []}>
    
    {/* Gradient */}
    <defs>
      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#A5B4FC" stopOpacity={0}/>
      </linearGradient>
    </defs>

    <CartesianGrid strokeDasharray="3 3" />

    <XAxis dataKey="date" />

    <YAxis />

    <Tooltip formatter={(value)=> `₹${value.toFixed(2)}`} />

    <Area
      type="monotone"
      dataKey="amount"
      stroke="#6366F1"
      fill="url(#salesGradient)"
      strokeWidth={3}
    />

  </AreaChart>
</ResponsiveContainer>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default AdminSales