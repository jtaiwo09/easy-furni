"use client";
import React, { useCallback } from "react";
import QtyButton from "./QtyButton";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import Link from "next/link";
import CustomButton from "./form/CustomButton";
import { AiOutlineSend } from "react-icons/ai";
import { currencyConverter } from "@/utils/helperFunc";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlistSlice";
import { toast } from "react-toastify";
import Image from "next/image";

function ProductDetailInfo({
  data,
  averageRating,
}: {
  data: Product;
  averageRating: string;
}) {
  const { cart } = useAppSelector((state) => state.cart);
  const { wishlist } = useAppSelector((state) => state.wishlist);
  const dispatch = useAppDispatch();

  const itemInCart = useCallback(() => {
    return cart.some((i) => i._id === data._id);
  }, [cart]);

  const itemInWishlist = useCallback(() => {
    return wishlist.some((i) => i._id === data._id);
  }, [wishlist]);

  // Add and remove Item in wishlist
  const handleWishlist = () => {
    if (itemInWishlist()) {
      dispatch(removeFromWishlist(data._id));
      toast.info("Item removed from wishlist!");
    } else {
      if (data.stock < 1) {
        toast.error("Product Out of Stock");
      } else {
        dispatch(addToWishlist(data));
        toast.success("Item added to wishlist");
      }
    }
  };

  return (
    <div className="w-full lg:w-[60%]">
      <h1 className="text-xl sm:text-2xl font-medium">{data.name}</h1>
      <p className="flex items-center my-3 sm:my-5  font-medium text-primary">
        <span className="mr-4 inline-block text-lg sm:text-2xl">
          {currencyConverter(data.discountPrice)}
        </span>
        <sup className="line-through text-red-400 text-sm sm:text-base ">
          {currencyConverter(data.originalPrice)}
        </sup>
      </p>
      <p
        className="mb-5 text-faded-primary"
        dangerouslySetInnerHTML={{ __html: data.description }}
      ></p>
      <div className="flex gap-3 mb-5 flex-col sm:flex-row">
        <QtyButton data={data} itemInCart={itemInCart} />
        <button
          onClick={handleWishlist}
          className={`w-full max-w-[450px] text-xl sm:w-12 h-12 flex justify-center items-center bg-transparent border duration-500 transition-all hover:border-primary`}
        >
          {itemInWishlist() ? <BsHeartFill /> : <BsHeart />}
        </button>
      </div>
      <div className="flex flex-wrap gap-4 sm:gap-6">
        <div className="flex items-center mb-4">
          <Image
            src={data.shop.avatar.url}
            alt=""
            width={40}
            height={40}
            className="h-[40px] w-[40px] object-cover"
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
