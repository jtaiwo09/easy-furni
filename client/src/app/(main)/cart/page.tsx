"use client";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import CustomButton from "@/components/form/CustomButton";
import React from "react";
import { GiShoppingCart } from "react-icons/gi";

function page() {
  return (
    <div className="mt-[70px]">
      <CustomBreadCrumb />
      <div className="container px-4">
        <div className="w-full px-4">
          <div className="w-fit mx-auto my-[2%] text-center">
            <GiShoppingCart className="mx-auto text-8xl mb-5 text-primary/60" />
            <p className="mb-5 text-sm">Your cart is currently empty</p>
            <CustomButton extraClass="uppercase py-2.5" text="return to shop" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
