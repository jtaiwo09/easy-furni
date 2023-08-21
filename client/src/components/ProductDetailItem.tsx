"use client";
import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SlideArrow from "./SlideArrow";
import Image from "next/image";

export default function ProductDetailItem({ data }: any) {
  const slicker = useRef<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SlideArrow />,
    afterChange: (index: any) => setCurrentSlide(index),
  };
  const changeSlide = (i: any) => {
    slicker.current.slickGoTo(i);
  };
  return (
    <>
      <Slider {...settings} ref={slicker}>
        {data &&
          data?.map((item: any, i: string) => (
            <div
              className="bg-[#f4f4f4] pt-4 px-4 sm:px-0 h-[250px] sm:h-[60vh] relative"
              key={i}
            >
              <Image
                src={item.url}
                alt=""
                fill
                priority
                className="w-full h-[100%] object-contain mix-blend-darken"
              />
            </div>
          ))}
      </Slider>

      <div className="flex gap-3 bg-[#f4f4f4] mt-4 pb-4">
        {data.map((el: any, i: any) => (
          <button
            key={i}
            className={`bg-inherit p-[2px] select-none ${
              currentSlide === i && "border border-red-400 border-solid"
            }`}
            onClick={() => changeSlide(i)}
          >
            <Image
              src={el.url}
              alt=""
              width={45}
              height={45}
              className="w-[45px] h-[45px] object-cover mix-blend-darken"
            />
          </button>
        ))}
      </div>
    </>
  );
}
