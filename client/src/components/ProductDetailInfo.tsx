"use client";
import React from "react";
import QtyButton from "./QtyButton";
import { BsHeart } from "react-icons/bs";
import Link from "next/link";
import CustomButton from "./form/CustomButton";
import { AiOutlineSend } from "react-icons/ai";
import { currencyConverter } from "@/utils/helperFunc";

function ProductDetailInfo({
  data,
  averageRating,
}: {
  data: Product;
  averageRating: string;
}) {
  return (
    <div className="w-full lg:w-[60%]">
      <h1 className="mb-5 text-3xl font-medium">{data.name}</h1>
      <p className="flex items-center mb-5 text-2xl font-medium text-primary">
        <span className="mr-4 inline-block">
          {currencyConverter(data.discountPrice)}
        </span>
        <sup className="line-through text-red-400 text-base ">
          {currencyConverter(data.originalPrice)}
        </sup>
      </p>
      <p
        className="mb-5 text-faded-primary"
        dangerouslySetInnerHTML={{ __html: data.description }}
      ></p>
      <div className="flex gap-3 mb-5 flex-col sm:flex-row">
        <QtyButton />
        <button className="w-full max-w-[450px] sm:w-12 h-12 flex justify-center items-center bg-transparent border border-borderCol duration-500 transition-all hover:border-primary">
          <BsHeart className="text-xl" />
        </button>
      </div>
      <div className="flex flex-wrap gap-4 sm:gap-6">
        <div className="flex items-center mb-4">
          <img
            src={data.shop.avatar.url}
            alt=""
            className="h-full w-[40px] object-contain"
          />
          <div className="ml-3">
            <Link
              href="#"
              className="text-sm hover:underline underline-offset-2 block mb-1 font-medium"
            >
              {data.shop.name}
            </Link>
            <p className="text-sm">({averageRating}) Rating</p>
          </div>
        </div>
        <CustomButton text="Send message" extraClass="h-fit w-full sm:w-fit">
          <AiOutlineSend className="text-lg ml-2" />
        </CustomButton>
      </div>
    </div>
  );
}

export default ProductDetailInfo;
