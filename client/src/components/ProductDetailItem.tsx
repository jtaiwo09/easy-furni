"use client";
import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SlideArrow from "./SlideArrow";

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
            <div className="bg-[#f4f4f4] h-[40vh] lg:h-[60vh]" key={i}>
              <img
                src={item.url}
                alt=""
                className="w-full h-[80%] object-contain mix-blend-darken"
              />
            </div>
          ))}
      </Slider>

      <div className="flex gap-3 bg-[#f4f4f4] absolute bottom-4">
        {data.map((el: any, i: any) => (
          <button
            key={i}
            className={`bg-inherit p-[2px] select-none ${
              currentSlide === i && "border border-red-400 border-solid"
            }`}
            onClick={() => changeSlide(i)}
          >
            <img
              src={el.url}
              alt=""
              className="w-[45px] h-[45px] object-cover mix-blend-darken"
            />
          </button>
        ))}
      </div>
    </>
  );
}
