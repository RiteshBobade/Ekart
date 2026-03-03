import React, { useState, useEffect } from "react";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ProductImg = ({ images = [] }) => {
  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    if (images.length > 0 && images[0]?.url) {
      setMainImg(images[0].url);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return <div>Loading images...</div>;
  }

  return (
    <div className="flex gap-5 w-max">
      <div className="gap-3 flex flex-col">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.url}
            alt="product"
            onClick={() => setMainImg(img.url)}
            className="cursor-pointer w-20 h-20 border shadow-lg"
          />
        ))}
      </div>

     
        {mainImg && (
          <Zoom>
            <img
            src={mainImg}
            alt="main"
            className="w-[450px] border shadow-lg"
          />
          </Zoom>
          
        )}
     


    </div>
  );
};

export default ProductImg;
