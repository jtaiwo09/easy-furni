"use client";
import React, { useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import Slider from "react-slick";
import Product from "./Product";
import Loader from "./Layout/Loader";

function BestDeals({ products }: any) {
  const [data, setData] = useState<any>([]);
  const [numOfSlides, setnumOfSlides] = useState(4);

  useEffect(() => {
    const best_deals = products
      .sort((a: any, b: any) => b.sold_out - a.sold_out)
      .slice(0, 5);
    setData(best_deals);

    if (best_deals.length > 4) {
      setnumOfSlides(4);
    } else if (best_deals.length <= 4 && best_deals.length > 2) {
      setnumOfSlides(3);
    } else if (best_deals.length > 1 && best_deals.length <= 2) {
      setnumOfSlides(2);
    } else {
      setnumOfSlides(1);
    }
  }, [products]);

  const settings = {
    infinite: true,
    slidesToShow: numOfSlides,
    slidesToScroll: 1,
    autoplay: true,
    // speed: 4000,
    autoplaySpeed: 4000,
    // cssEase: "linear",
  };

  if (!data?.length) return <Loader />;

  return (
    <div className="pb-[60px] px-5">
      <h1 className="text-[24px] mb-5 font-bold leading-[30px] tracking-[1px] text-primary text-center">
        Best Deals
      </h1>
      <div className="px-[40px] py-5 w-full">
        {data ? (
          <Slider {...settings} className="">
            {data.length &&
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

export default BestDeals;
