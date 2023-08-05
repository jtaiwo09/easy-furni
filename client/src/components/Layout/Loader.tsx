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
    <div className="w-full h-screen flex items-center justify-center bg-black/40 z-[999] fixed top-0 bottom-0">
      <Lottie options={defaultOptions} width={300} height={300} />
    </div>
  );
};

export default Loader;
