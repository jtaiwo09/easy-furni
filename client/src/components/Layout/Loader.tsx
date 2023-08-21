"use client";
import React from "react";
import Lottie from "react-lottie";
import animationData from "../../../public/animations/loader.json";

const Loader = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black/50 z-[999] fixed left-0 right-0 top-0 bottom-0">
      <div className="-mt-[15%]">
        {/* <Lottie options={defaultOptions} width={300} height={300} /> */}
        <h1 className="text-4xl text-white">Loading...</h1>
      </div>
    </div>
  );
};

export default Loader;
