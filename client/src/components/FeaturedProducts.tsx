"use client";
import React, { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import Slider from "react-slick";
import Product from "./Product";

function FeaturedProducts({ products }: any) {
  const [data, setData] = useState([]);
  const [numOfSlides, setnumOfSlides] = useState(4);
  const settings = {
    infinite: true,
    slidesToShow: numOfSlides,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
  };

  useEffect(() => {
    setData(products.slice(0, 8));
    if (data.length > 4) {
      setnumOfSlides(4);
    } else if (data.length <= 4 && data.length > 2) {
      setnumOfSlides(3);
    } else {
      setnumOfSlides(1);
    }
  }, [products]);

  return (
    <div className="pb-[60px] px-5">
      <h1 className="text-[24px] mb-5 font-bold leading-[30px] tracking-[1px] text-primary text-center">
        Featured Products
      </h1>
      <div className="px-[40px] py-5 w-full">
        {data.length > 0 ? (
          <Slider {...settings} className="">
            {data &&
              data.map((item: any) => (
                <div className="" key={item._id}>
                  <Product data={item} />
                </div>
              ))}
          </Slider>
        ) : (
          <div className="text-5xl flex justify-center items-center w-full h-[200px]">
            <BiLoader className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

export default FeaturedProducts;
