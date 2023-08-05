"use client";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { carousel, heroText } from "../../utils/data";
import "./style.css";
import Link from "next/link";
import { RxChevronLeft, RxChevronRight } from "react-icons/rx";

function Carousel() {
  const [bg, setBg] = useState("#F7F0EB");
  const slickLeft = useRef<any>(null);
  const slickRight = useRef<any>(null);
  const handleClick = (dir: string) => {
    if (dir === "next") {
      slickRight.current.slickPrev();
      slickLeft.current.slickNext();
    } else {
      slickRight.current.slickNext();
      slickLeft.current.slickPrev();
    }
  };

  const settings1 = {
    dots: false,
    arrows: false,
    infinite: true,
    draggable: false,
    easing: "ease-in-out",
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 2000,
    autoplaySpeed: 10000,
    waitForAnimate: true,
    autoplay: false,
    pauseOnHover: false,
    vertical: true,
    verticalSwiping: true,
    fade: false,
    beforeChange: function (currentSlide: any, nextSlide: any) {
      switch (nextSlide) {
        case 0:
          setBg("#F7F0EB");
          break;
        case 1:
          setBg("#FFEDCA");
          break;
        case 2:
          setBg("#FFE6DD");
          break;
      }
    },
    afterChange: function (currentSlide: any) {
      //
    },
  };

  const settings2 = {
    ...settings1,
    rtl: true,
  };

  useEffect(() => {
    handleClick("next");
  }, []);

  return (
    <div className="relative w-full">
      <div className="flex flex-col-reverse lg:flex-row h-screen overflow-hidden">
        <div className="h-1/2 lg:h-full flex-1 lg:w-1/2">
          <Slider {...settings1} className="" ref={slickLeft}>
            {heroText.map((item, i) => (
              <div
                key={i}
                className="h-full lg:!flex items-center justify-center"
              >
                <div className="w-fit px-5 lg:px-[50px] mx-auto mt-[15%] lg:mt-0 text-center lg:text-left">
                  <h1 className="text-[32px] lg:text-[45px] font-bold max-w-[400px] lg:max-w-[600px] leading-[1.5]">
                    {item.header}
                  </h1>
                  <p className="text-[rgb(132,132,132)] leading-[22px] text-sm font-medium my-5">
                    {item.text}
                  </p>
                  <Link
                    href={item.link}
                    className="uppercase text-white text-sm inline-flex justify-center items-center bg-primary h-[48px] min-w-[140px]"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            ))}
          </Slider>
        </div>
        <div className="h-1/2 lg:h-full flex-1 lg:w-1/2">
          <Slider {...settings2} className="" ref={slickRight}>
            {carousel.map((item, i) => (
              <Image
                key={i}
                src={item.img}
                alt=""
                className="h-[70%] !w-[70%] object-contain"
              />
            ))}
          </Slider>
        </div>
      </div>
      <div className="w-1/2 h-full bg-white absolute top-0 left-0 -z-[1]"></div>
      <div
        style={{ backgroundColor: bg }}
        className="w-1/2 h-full absolute top-0 right-0 -z-[1]"
      ></div>
      <div className="absolute bottom-0 left-[50%] -translate-x-[50%] flex justify-center">
        <button
          onClick={() => handleClick("prev")}
          className="w-12 h-12 lg:w-[65px] lg:h-[65px] bg-black flex justify-center items-center cursor-pointer"
        >
          <RxChevronLeft className="text-3xl text-white" />
        </button>
        <button
          onClick={() => handleClick("next")}
          className="w-12 h-12 lg:w-[65px] lg:h-[65px] bg-white flex justify-center items-center cursor-pointer"
        >
          <RxChevronRight className="text-3xl" />
        </button>
      </div>
    </div>
  );
}

export default Carousel;
