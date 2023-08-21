"use client";
import Image from "next/image";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function HeroCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 5000,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };
  const images = [
    {
      id: "1",
      url: "https://res.cloudinary.com/citi-tasker/image/upload/v1692616527/hero-sliders/hero1_gajtnd.jpg",
    },
    // {
    //   id: "2",
    //   url: "https://res.cloudinary.com/citi-tasker/image/upload/v1692624160/hero-sliders/hero7_tixq7a.jpg",
    // },
    {
      id: "3",
      url: "https://res.cloudinary.com/citi-tasker/image/upload/v1692623376/hero-sliders/hero6_h02d58.jpg",
    },
    // {
    //   id: "4",
    //   url: "https://res.cloudinary.com/citi-tasker/image/upload/v1692622179/hero-sliders/hero3_bww4ew.jpg",
    // },
    {
      id: "5",
      url: "https://res.cloudinary.com/citi-tasker/image/upload/v1692622716/hero-sliders/hero4_oqko6s.jpg",
    },
    {
      id: "6",
      url: "https://res.cloudinary.com/citi-tasker/image/upload/v1692623212/hero-sliders/hero5_emrmsz.jpg",
    },
    {
      id: "7",
      url: "https://res.cloudinary.com/citi-tasker/image/upload/v1692617773/hero-sliders/hero2_jvhnev.jpg",
    },
  ];
  return (
    <div className="relative w-full h-[70vh] sm:h-screen">
      <Slider {...settings}>
        {images.map((el) => (
          <div className="relative h-[70vh]  sm:h-[calc(100vh-40px)]">
            <Image
              key={el.id}
              src={el.url}
              alt=""
              fill
              priority
              className="h-full w-full mx-auto object-cover mix-blend-lighten"
            />
            {/* <div className="absolute p-5 max-w-[500px] w-[90%] py-5 h-fit m-auto top-0 bottom-0 left-0 right-0 bg-black/30 text-white text-center">
              <h1 className="text-6xl font-medium uppercase mb-2">Shoes</h1>
              <p className="mb-4 text-2xl tracking-wider">
                Nice pair of sneakers
              </p>
              <CustomButton
                text="Shop Now"
                extraClass="mx-auto min-w-[150px]"
              />
            </div> */}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HeroCarousel;
