import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Package, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';

const OrderCard = ({ userOrder }) => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="rounded-full shadow-sm hover:bg-secondary border-border/50">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Order History</h1>
            <p className="text-muted-foreground text-sm">View and manage your recent purchases</p>
          </div>
        </div>

        {/* No orders */}
        {!userOrder || !Array.isArray(userOrder) || userOrder.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 glass-card rounded-3xl border border-border/50 text-center"
          >
            <div className="bg-secondary/50 p-6 rounded-full mb-6">
              <Package className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No orders found</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">Looks like you haven't made any purchases yet. Start shopping to see your orders here.</p>
            <Button onClick={() => navigate('/products')} className="px-8 shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform">
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 w-full"
          >
            {/* DEBUG BLOCK FOR DATA VERIFICATION */}
            {/* <div className="bg-red-500/10 p-4 text-red-500 rounded">
                 Found {userOrder.length} orders
            </div> */}

            {Array.isArray(userOrder) && userOrder.map((order) => (
              <motion.div
                variants={itemVariants}
                key={order._id}
                className="glass-card rounded-2xl overflow-hidden border border-border/50 shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* Order Header */}
                <div className="bg-secondary/30 p-6 border-b border-border/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg font-bold">Order <span className="text-muted-foreground font-mono text-sm ml-1">#{order._id.slice(-8).toUpperCase()}</span></h2>
                      <Badge variant={
                        order.status === "Paid" || order.status === "Delivered" ? "default" :
                        order.status === "Failed" || order.status === "Cancelled" ? "destructive" :
                        "secondary"
                      } className={
                        order.status === "Paid" || order.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : ""
                      }>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(order?.createdAt || Date.now()).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> {order.currency || "INR"}</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto">
                    <span className="text-sm text-muted-foreground mb-1 md:block hidden">Total Amount</span>
                    <span className="text-2xl font-black text-primary">
                      {order.currency === 'INR' ? '₹' : (order.currency || '₹')} {order?.amount?.toFixed?.(2) || "0.00"}
                    </span>
                  </div>
                </div>

                {/* Products List */}
                <div className="p-6">
                  <div className="space-y-4">
                    {(order.products || []).map((product, index) => (
                      <div
                        key={index}
                        onClick={() => navigate(`/products/${product?.productId?._id}`)}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/30 transition-colors cursor-pointer group"
                      >
                        <div className="relative overflow-hidden rounded-lg bg-secondary min-w-[80px]">
                          <img
                            className="w-20 h-20 object-cover group-hover:scale-110 transition-transform duration-500"
                            src={product?.productId?.productImg?.[0]?.url || 'https://via.placeholder.com/150'}
                            alt={product?.productId?.productName || 'Product Image'}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                            {product?.productId?.productName || 'Unnamed Product'}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {product?.productId?.productDesc || "No description available."}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-medium text-foreground">
                            {order.currency === 'INR' ? '₹' : (order.currency || '₹')}{(product?.productId?.productPrice || 0).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Qty: <span className="font-semibold text-foreground">{product.quantity || 1}</span>
                          </div>
                        </div>

                        <div className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                           <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Admin User Info (If viewing from admin panel) */}
                  {order.user && (
                    <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-start gap-4 bg-secondary/10 p-4 rounded-xl">
                      <div>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 block">Customer Details</span>
                        <p className="text-sm font-medium text-foreground">
                          {order?.user?.firstName || "Unknown"} {order?.user?.lastName || ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.user?.email || "N/A"}
                        </p>
                      </div>
                      {(order.user?.address || order.user?.city) && (
                         <div className="sm:text-right">
                           <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 block">Shipping Address</span>
                           <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                             {order?.user?.address}, {order?.user?.city}
                           </p>
                         </div>
                      )}
                    </div>
                  )}

                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;