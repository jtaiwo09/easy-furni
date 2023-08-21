"use client";
import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black/50 z-[999] fixed left-0 right-0 top-0 bottom-0">
      <div className="-mt-[15%]">
        <h1 className="text-4xl text-white">
          <AiOutlineLoading3Quarters
            size={60}
            className="text-white animate-spin"
          />
        </h1>
      </div>
    </div>
  );
};

export default Loader;
