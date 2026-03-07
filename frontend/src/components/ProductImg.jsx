import React, { useState, useEffect } from "react";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { motion } from 'framer-motion'

const ProductImg = ({ images = [] }) => {
  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    if (images.length > 0 && images[0]?.url) {
      setMainImg(images[0].url);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return <div className="animate-pulse bg-muted rounded-xl w-full h-[500px]"></div>;
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 w-full max-w-2xl">
      {/* Thumbnail List */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto max-h-[500px] custom-scrollbar pb-2 md:pb-0 pr-2">
        {images.map((img, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMainImg(img.url)}
            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden glass transition-all ${mainImg === img.url ? 'ring-2 ring-primary border-transparent' : 'border-border opacity-70 hover:opacity-100'}`}
          >
            <img
              src={img.url}
              alt={`thumbnail-${index}`}
              className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
            />
          </motion.button>
        ))}
      </div>

      {/* Main Image */}
      <motion.div 
        key={mainImg}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 glass-card rounded-2xl overflow-hidden flex items-center justify-center p-4 bg-white/5 dark:bg-black/20"
      >
        {mainImg && (
          <Zoom>
            <img
              src={mainImg}
              alt="Main Product"
              className="w-full max-w-[450px] object-contain drop-shadow-xl mix-blend-multiply dark:mix-blend-normal cursor-zoom-in"
            />
          </Zoom>
        )}
      </motion.div>
    </div>
  );
};

export default ProductImg;
