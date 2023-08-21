"use client";
import React, { useEffect, useState } from "react";
import { categoriesData } from "@/utils/data";
import Slider from "react-slick";
import Product from "./Product";
import { BiLoader } from "react-icons/bi";

function Categories({ products }: any) {
  const [cat, setCat] = useState(1);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [numOfSlides, setnumOfSlides] = useState(4);

  const settings = {
    infinite: true,
    slidesToShow: numOfSlides,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: filteredData?.length >= 2 ? 2 : 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    setFilteredData(products.slice(0, 8));

    if (products && products?.length > 4) {
      setnumOfSlides(4);
    } else if (products.length <= 4 && products.length > 2) {
      setnumOfSlides(3);
    } else if (products.length > 1 && products.length <= 2) {
      setnumOfSlides(2);
    } else {
      setnumOfSlides(1);
    }
  }, [products]);

  const handleFilter = (item: any) => {
    products.forEach((el: any, i: any) => {}), setCat(item.id);
    const data = products
      ? products.filter((product: any) =>
          product.category?.toLowerCase().includes(item.title.toLowerCase())
        )
      : [];

    if (data && data?.length > 4) {
      setnumOfSlides(4);
    } else if (data.length <= 4 && data.length > 2) {
      setnumOfSlides(3);
    } else if (data.length > 1 && data.length <= 2) {
      setnumOfSlides(2);
    } else {
      setnumOfSlides(1);
    }

    setFilteredData(data);
  };
  const productCount = (title: string) => {
    return products
      ? products.filter((el: any) => el.category === title)?.length
      : 0;
  };
  return (
    <div className="pb-[60px] px-5">
      <h1 className="text-[24px] mb-5 font-bold leading-[30px] tracking-[1px] text-primary text-center">
        Categories
      </h1>
      <div className="flex gap-5 lg:gap-2.5 h-max flex-col-reverse lg:flex-row my-5">
        <div className="lg:max-w-[430px] w-full lg:w-[30%] overflow-scroll max-h-[300px]">
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-y-1 gap-x-1 lg:border border-[rgba(215,215,215,1)]">
            {categoriesData &&
              categoriesData.map((item) => {
                if (productCount(item.title) !== 0) {
                  return (
                    <li
                      key={item.id}
                      className={`${
                        item.id == cat
                          ? "bg-primary text-white"
                          : "bg-[#ebebeb] text-primary"
                      }  py-4 px-[50px] mb-0.5 last:mb-0 leading-6 flex items-center cursor-pointer hover:bg-primary hover:text-[#ebebeb]`}
                      onClick={() => handleFilter(item)}
                    >
                      <img
                        src={item.image_Url}
                        alt=""
                        className="mr-[30px] w-[40px] h-[40px] object-contain"
                      />
                      <span className="">
                        <span className="uppercase text-base font-semibold block">
                          {item.title}
                        </span>
                        <span className="block text-sm">
                          {productCount(item.title)} Products
                        </span>
                      </span>
                    </li>
                  );
                }
              })}
          </ul>
        </div>
        <div className="flex-1 h-fit border border-[rgba(215,215,215,1)] py-5 ">
          {categoriesData.map((item) => {
            if (item.id === cat) {
              return (
                <img
                  key={item.id}
                  src={item.image_Url}
                  alt=""
                  className="h-[200px] sm:h-[300px] w-full object-contain"
                />
              );
            }
          })}
        </div>
      </div>
      <div className="sm:px-[40px] sm:py-5 sm:border border-borderCol w-full">
        {filteredData ? (
          <Slider {...settings} className="">
            {filteredData &&
              filteredData.map((item: any) => (
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

export default Categories;
