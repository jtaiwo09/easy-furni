"use client";
import React, { useCallback, useRef, useState } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineSend,
} from "react-icons/ai";
import { BsCart3 } from "react-icons/bs";
import CustomModal from "./CustomModal";
import Slider from "react-slick";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { BsStar, BsStarFill } from "react-icons/bs";
import Link from "next/link";
import CustomButton from "./form/CustomButton";
import QtyButton from "./QtyButton";
import { currencyConverter } from "@/utils/helperFunc";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import { HiOutlineCheckCircle } from "react-icons/hi";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlistSlice";

function Product({ data }: { data: Product }) {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { cart } = useAppSelector((state) => state.cart);
  const { wishlist } = useAppSelector((state) => state.wishlist);

  const ref = useRef<any>(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    vertical: false,
    draggable: true,
    easing: "ease-in-out",
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    verticalSwiping: true,
  };

  const itemInCart = useCallback(() => {
    return cart.some((i) => i._id === data._id);
  }, [cart]);

  const itemInWishlist = useCallback(() => {
    return wishlist.some((i) => i._id === data._id);
  }, [wishlist]);

  const handleClick = () => {
    setOpen((prevState) => !prevState);
  };

  const handleArrow = (dir: string) => {
    if (dir === "next") {
      ref.current.slickNext();
    } else {
      ref.current.slickPrev();
    }
  };

  // Add and remove Item in cart
  const handleCart = (id: string) => {
    if (itemInCart()) {
      dispatch(removeFromCart(id));
      toast.info("Item removed from cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart");
      }
    }
  };

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

  const perDiscount = () => {
    return (
      (
        ((data.discountPrice - data.originalPrice) / data.discountPrice) *
        100
      ).toFixed() + "%"
    );
  };

  return (
    <div className="relative pr-2 mb-5">
      <div className="overflow-hidden relative group/icons bg-[#F4F4F4] p-5 h-[280px]">
        <span className="inline-block text-center text-sm w-14 py-0.5 text-white bg-[#9E0A0F] absolute top-2 right-2 z-20">
          {perDiscount()}
        </span>
        <Link href={`/product/${data._id}`}>
          <img
            src={data.images[0].url}
            alt=""
            className="h-full w-full object-contain mix-blend-darken hover:scale-[1.2] transition-transform duration-500"
          />
        </Link>
        <div className="hidden lg:block absolute bottom-0 right-2 duration-[.3s] translate-y-[100%] group-hover/icons:translate-y-0">
          <div
            onClick={handleClick}
            className="relative group mb-2.5 translate-y-14 opacity-0 group-hover/icons:opacity-100 group-hover/icons:translate-y-0 group-hover/icons:delay-[.2s] duration-[0.6s]"
          >
            <div className="w-10 h-10 border bg-white border-[#323232] center cursor-pointer z-[2] bg-transparent">
              <AiOutlineEye className="text-xl z-10 group-hover:text-white transition-all duration-5[1s]delay-200" />
            </div>
            <div className="absolute overflow-hidden cursor-pointer top-0 right-0 bg-primary group-hover:w-[150px] h-full w-0 transition-all duration-500">
              <div className="pr-10 w-full h-full flex items-center justify-center text-white whitespace-nowrap text-sm">
                Quick view
              </div>
            </div>
          </div>
          <div
            onClick={handleWishlist}
            className="relative group mb-2.5 translate-y-14 opacity-0 group-hover/icons:opacity-100 group-hover/icons:translate-y-0 group-hover/icons:delay-[.3s] duration-[0.6s]"
          >
            <div className="w-10 h-10 border bg-white border-[#323232] center cursor-pointer z-[2] bg-transparent">
              {itemInWishlist() ? (
                <AiFillHeart className="text-xl z-10 group-hover:text-white transition-all duration-500 delay-200" />
              ) : (
                <AiOutlineHeart className="text-xl z-10 group-hover:text-white transition-all duration-500 delay-200" />
              )}
            </div>
            <div className="absolute overflow-hidden cursor-pointer top-0 right-0 bg-primary group-hover:w-[170px] h-full w-0 transition-all duration-500">
              <div className="pr-10 w-full h-full flex items-center justify-center text-white whitespace-nowrap text-sm">
                {itemInWishlist() ? "Remove" : "Add to wishlist"}
              </div>
            </div>
          </div>
          <div
            onClick={() => handleCart(data._id)}
            className="relative group mb-2.5 translate-y-14 opacity-0 group-hover/icons:opacity-100 group-hover/icons:translate-y-0 group-hover/icons:delay-[.4s] duration-[0.6s]"
          >
            <div className="w-10 h-10 border bg-white border-[#323232] center cursor-pointer z-[2] bg-transparent">
              {itemInCart() ? (
                <HiOutlineCheckCircle className="text-xl z-10 group-hover:text-white transition-all duration-500 delay-200" />
              ) : (
                <BsCart3 className="text-xl z-10 group-hover:text-white transition-all duration-500 delay-200" />
              )}
            </div>
            <div className="absolute overflow-hidden cursor-pointer top-0 right-0 bg-primary group-hover:w-[150px] h-full w-0 transition-all duration-500">
              <div className="pr-10 w-full h-full flex items-center justify-center text-white whitespace-nowrap text-sm">
                {itemInCart() ? "Remove" : "Add to cart"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-[22px] text-primary group hover:!text-text-hover">
        <Link
          href={`/product/${data._id}`}
          className="mb-1.5 leading-[20px] text-inherit block truncate group-hover:font-semibold"
        >
          {data.name}
        </Link>
        <p className="">
          <span className="px-1.5 text-primary/40 line-through leading-5">
            {currencyConverter(data.discountPrice)}
          </span>
          <span className="px-1.5 text-inherit leading-5">
            {currencyConverter(data.originalPrice)}
          </span>
        </p>
        <div className="flex lg:hidden gap-3 justify-center mt-2">
          <button className="w-[40px] h-[40px] center border border-[#d7d7d7] rounded-[5px]">
            <AiOutlineHeart className="text-[18px]" />
          </button>
          <button className="w-[40px] h-[40px] center border border-[#d7d7d7] rounded-[5px]">
            <BsCart3 className="text-[18px]" />
          </button>
        </div>
      </div>

      <CustomModal
        open={open}
        handleClose={handleClick}
        boxStyle="!max-w-[1000px]"
      >
        <div className="flex flex-col md:flex-row w-full h-[calc(80vh-60px)]">
          <div className="w-full md:w-1/2 flex-1  bg-[#f4f4f4] relative overflow-hidden group">
            <Slider
              {...settings}
              ref={ref}
              className="flex-1 w-full bg-transparent"
            >
              {data?.images?.map((img: any, i: any) => (
                <div
                  key={i}
                  className="h-full w-full py-5 !flex items-center bg-[#f4f4f4]"
                >
                  <img
                    key={i}
                    src={img.url}
                    alt=""
                    className="w-[70%] h-[100%] object-contain block mx-auto mix-blend-darken"
                  />
                </div>
              ))}
            </Slider>
            <div className="absolute top-0 bottom-0 my-auto h-fit w-full flex justify-between">
              <button
                onClick={() => handleArrow("prev")}
                className="-translate-x-[100%] group-hover:translate-x-2 duration-500 rounded-sm w-[50px] h-[50px] my-auto select-none cursor-pointer flex items-center justify-center bg-white box-shadow"
              >
                <BsChevronLeft className="text-xl text-black/50" />
              </button>
              <button
                onClick={() => handleArrow("next")}
                className="translate-x-[100%] group-hover:-translate-x-2 duration-500 rounded-sm w-[50px] h-[50px] my-auto select-none cursor-pointer flex items-center justify-center bg-white box-shadow"
              >
                <BsChevronRight className="text-xl text-black/50" />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full md:w-1/2 bg-white overflow-scroll mt-5">
            <div className="px-[35px]">
              <div className="mb-[30px] flex gap-5 items-center">
                <div className="text-primary flex gap-1">
                  {Array.from({ length: data.rating }, (_, i) => (
                    <BsStarFill key={i} />
                  ))}
                  {Array.from({ length: 5 - data.rating }, (_, i) => (
                    <BsStar key={i} />
                  ))}
                </div>
                <Link href="#" className="underline decoration-1 text-primary">
                  {data.reviews.length < 1 ? "No" : data.reviews.length} reviews
                </Link>
              </div>
              <div className="text-primary">
                <Link
                  href="#"
                  className="block text-2xl font-medium text-inherit mb-5"
                >
                  {data.name}
                </Link>
                <div className="flex items-center mb-5 text-base font-semibold">
                  <p className="mr-4">
                    {currencyConverter(data.originalPrice)}
                  </p>
                  <sup className="line-through text-red-400 text-sm ">
                    {currencyConverter(data.discountPrice)}
                  </sup>
                </div>
                <p
                  className="mb-5 text-sm leading-[26px] tracking-[0.5px]"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                ></p>
                <div className="mb-[27px]">
                  <QtyButton />
                </div>
                <div className="mb-2">
                  <p className="mb-2.5">SKU: Ch002</p>
                  <p className="mb-2.5">Categories: {data.category}</p>
                  <p className="mb-2.5">
                    Tags: {data.tags ? data.tags.split(" ").join(", ") : null}
                  </p>
                </div>
                <div className="">
                  <div className="flex items-center mb-4">
                    <img
                      src={data.shop.avatar.url}
                      alt=""
                      className="h-[40px] w-[40px] object-contain"
                    />
                    <div className="ml-3">
                      <Link
                        href="#"
                        className="text-sm hover:underline underline-offset-2 block mb-1 font-medium"
                      >
                        {data.shop.name}
                      </Link>
                      <p className="text-sm">
                        ({data.shop?.ratings ?? 0}) Rating
                      </p>
                    </div>
                  </div>
                  <CustomButton text="Send message">
                    <AiOutlineSend className="text-lg ml-2" />
                  </CustomButton>
                  <p className="text-red-400 font-medium mt-4 text-sm">
                    ({data.sold_out}) sold out
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}

export default Product;
