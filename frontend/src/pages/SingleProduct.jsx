import React from 'react'
import Breadcrums from '@/components/Breadcrums'
import ProductImg from '@/components/ProductImg'
import ProductDesc from '@/components/ProductDesc'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const SingleProduct = () => {
  const params = useParams();
  const productId = params.id;
  const { products } = useSelector((store) => store.product);

  const product = products.find((item) => item._id === productId);

  if (!product) {
    return <div className="pt-25 text-center">Loading product...</div>;
  }

  return (
    <div className="pt-25 py-10 max-w-7xl mx-auto">
      <Breadcrums product={product} />
      <div className="mt-10 grid grid-cols-2 items-start">
        <ProductImg images={product.productImg} />
        <ProductDesc product={product} />
      </div>
    </div>
  );
};

export default SingleProduct
