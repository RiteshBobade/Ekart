import React from 'react'
import Breadcrums from '@/components/Breadcrums'
import ProductImg from '@/components/ProductImg'
import ProductDesc from '@/components/ProductDesc'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Skeleton } from "@/components/ui/skeleton"

const SingleProduct = () => {
  const params = useParams();
  const productId = params.id;
  const { products } = useSelector((store) => store.product);

  const product = products.find((item) => item._id === productId);

  if (!product) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <Skeleton className="h-8 w-64 mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <Skeleton className="h-[500px] w-full rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-16 w-1/3" />
              <Skeleton className="h-40 w-full mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 min-h-screen bg-background"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Breadcrums product={product} className="text-muted-foreground hover:text-foreground transition-colors" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <ProductImg images={product.productImg} />
          <ProductDesc product={product} />
        </div>
      </div>
    </motion.div>
  );
};

export default SingleProduct
