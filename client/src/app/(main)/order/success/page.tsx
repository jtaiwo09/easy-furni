"use client";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import React from "react";
import Lottie from "react-lottie";
import animationData from "../../../../../public/animations/107043-success.json";

function page() {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="mt-[70px] min-h-[calc(100vh-409px)] bg-[#f4f4f4]">
      <CustomBreadCrumb />
      <div className="container px-4 ">
        <Lottie options={defaultOptions} width={300} height={300} />
        <h5 className="text-center mb-14 text-[25px] text-primary">
          Your order is successful 😍
        </h5>
        <br />
        <br />
      </div>
    </div>
  );
}

export default page;
