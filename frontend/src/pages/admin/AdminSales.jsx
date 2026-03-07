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
import { motion } from 'framer-motion'
import { Users, Package, ShoppingCart, IndianRupee } from 'lucide-react'

const AdminSales = () => {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    sales: [] 
  })

  const fetchStats = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className='w-full max-w-7xl mx-auto'>
      <div className="mb-10">
        <h1 className='text-3xl font-extrabold tracking-tight'>Sales Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-lg">Overview of your store's performance and metrics.</p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8'
      >
        {/* Total Users */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-border/50 shadow-lg overflow-hidden relative group h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                 <Users className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="z-10 relative">
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Products */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-border/50 shadow-lg overflow-hidden relative group h-full">
             <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                 <Package className="w-5 h-5 text-secondary-foreground" />
              </div>
            </CardHeader>
            <CardContent className="z-10 relative">
              <div className="text-3xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Orders */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-border/50 shadow-lg overflow-hidden relative group h-full">
             <div className="absolute inset-0 bg-gradient-to-br from-chart-3/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <div className="w-10 h-10 rounded-full bg-chart-3/10 flex items-center justify-center">
                 <ShoppingCart className="w-5 h-5 text-chart-3" />
              </div>
            </CardHeader>
            <CardContent className="z-10 relative">
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Sales */}
        <motion.div variants={itemVariants}>
          <Card className="glass-card border-border/50 shadow-lg overflow-hidden relative group h-full">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                 <IndianRupee className="w-5 h-5 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent className="z-10 relative">
              <div className="text-3xl font-bold text-foreground">
                ₹{stats.totalSales.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Sales Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card border-border/50 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-secondary/30 border-b border-border/50 pb-6 pt-8 px-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Revenue Overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Daily sales performance for the last 30 days</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-background border border-border/50 text-sm font-medium">
               Graph Data
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.sales || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.5)" />

                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    dy={10}
                  />

                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value}`}
                    dx={-10}
                  />

                  <Tooltip 
                    formatter={(value)=> [`₹${value.toLocaleString('en-IN', {maximumFractionDigits:2})}`, 'Revenue']}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background)/0.9)', 
                      backdropFilter: 'blur(10px)',
                      borderColor: 'hsl(var(--border)/0.5)',
                      borderRadius: '12px',
                      color: 'hsl(var(--foreground))',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '8px' }}
                  />

                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    fill="url(#salesGradient)"
                    strokeWidth={3}
                    activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdminSales