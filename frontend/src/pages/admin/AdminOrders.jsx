import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, PackageSearch, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const accessToken = localStorage.getItem("accessToken")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/all`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        if (data.success) setOrders(data.orders)
      } catch (error) {
        console.error("Failed to fetch admin orders", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [accessToken])

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
      case 'Delivered': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
      case 'Pending': return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
      case 'Failed':
      case 'Cancelled': return 'bg-destructive/10 text-destructive hover:bg-destructive/20'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh]'>
        <Loader2 className='w-10 h-10 animate-spin text-primary mb-4' />
        <p className='text-muted-foreground font-medium'>Loading Store Orders...</p>
      </div>
    )
  }

  return (
    <div className='w-full max-w-7xl mx-auto'>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className='text-3xl font-extrabold tracking-tight'>All Orders</h1>
          <p className="text-muted-foreground mt-2 text-lg">Manage and track all customer purchases.</p>
        </div>
        
        <div className='relative w-full md:w-[400px] shrink-0'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 z-10' />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-12 h-14 bg-background/50 border-input rounded-2xl shadow-sm text-base"
            placeholder="Search by order ID, name, or email..." 
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl border border-border/50 shadow-xl overflow-hidden"
      >
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="bg-secondary/50 p-6 rounded-full mb-6">
              <PackageSearch className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No orders found</h2>
            <p className="text-muted-foreground max-w-sm">There are no orders matching your current filters.</p>
          </div>
        ) : (
          <div className='overflow-x-auto w-full'>
            <table className='w-full text-left text-sm whitespace-nowrap'>
              <thead className='bg-secondary/30 text-muted-foreground uppercase tracking-wider text-xs'>
                <tr>
                  <th className='px-6 py-5 font-semibold border-b border-border/50 rounded-tl-3xl'>Order ID</th>
                  <th className='px-6 py-5 font-semibold border-b border-border/50'>Customer</th>
                  <th className='px-6 py-5 font-semibold border-b border-border/50'>Items (Qty)</th>
                  <th className='px-6 py-5 font-semibold border-b border-border/50'>Total Amount</th>
                  <th className='px-6 py-5 font-semibold border-b border-border/50'>Status</th>
                  <th className='px-6 py-5 font-semibold border-b border-border/50 rounded-tr-3xl'>Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <AnimatePresence>
                  {filteredOrders.map((order, i) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={order._id} 
                      className='hover:bg-secondary/30 transition-colors group cursor-default'
                    >
                      <td className='px-6 py-5 font-mono text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors'>
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className='px-6 py-5'>
                        <div className="font-bold text-foreground text-sm">
                          {order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : "Unknown User"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{order.user?.email || "No Email"}</div>
                      </td>
                      <td className='px-6 py-5'>
                        <div className="flex flex-col gap-1 max-w-[250px]">
                          {order.products.map((p, idx) => (
                            <div key={idx} className='text-xs text-muted-foreground truncate'>
                              <span className="font-medium text-foreground">{p.productName}</span> <span className="text-muted-foreground/70">x{p.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className='px-6 py-5 font-bold text-base'>
                        ₹{order.amount?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className='px-6 py-5'>
                        <Badge variant="outline" className={`border-0 font-semibold uppercase tracking-wider text-[10px] px-2.5 py-1 ${getStatusColor(order.status)}`}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className='px-6 py-5 text-muted-foreground'>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AdminOrders


