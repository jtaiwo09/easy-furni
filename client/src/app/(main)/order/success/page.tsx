"use client";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import React from "react";
import { BsBagCheck } from "react-icons/bs";

function page() {
  return (
    <div className="mt-[70px] min-h-[calc(100vh-409px)] bg-[#f4f4f4]">
      <CustomBreadCrumb />
      <div className="container px-4 ">
        <br />
        <br />
        <div className="mx-auto max-w-[500px] w-full p-5 bg-white rounded-md shadow-sm">
          <BsBagCheck size={60} className="text-green-500 mx-auto my-4" />
          <h5 className="text-center mb-14 text-lg font-medium text-primary">
            Your order is successful 😍
          </h5>
        </div>
        <br />
        <br />
      </div>
    </div>
  );
}

export default page;
