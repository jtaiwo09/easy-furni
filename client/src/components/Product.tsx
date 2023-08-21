"use client";
import React, { useCallback, useRef, useState } from "react";
import {
  AiFillCheckCircle,
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineSend,
} from "react-icons/ai";
import { BsBagCheckFill, BsCart3 } from "react-icons/bs";
import CustomModal from "./CustomModal";
import Slider from "react-slick";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Link from "next/link";
import CustomButton from "./form/CustomButton";
import QtyButton from "./QtyButton";
import { currencyConverter, truncate } from "@/utils/helperFunc";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/slices/wishlistSlice";
import Rating from "@mui/material/Rating";
import Image from "next/image";

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
        toast.error("Product is out of stock");
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
      <div className="overflow-hidden group/icons bg-[#F4F4F4] p-5 h-[280px] relative">
        <span className="inline-block text-center text-sm w-14 py-0.5 text-white bg-[#9E0A0F] absolute top-2 right-2 z-[2]">
          {perDiscount()}
        </span>
        <Link href={`/product/${data._id}`}>
          <Image
            src={data.images[0].url}
            alt=""
            fill
            className="h-full w-full object-contain mix-blend-darken hover:scale-[1.2] transition-transform duration-500"
          />
        </Link>
        <div className="hidden lg:block absolute bottom-0 right-2 duration-[.3s] translate-y-[100%] group-hover/icons:translate-y-0">
          <div
            onClick={handleClick}
            className="relative group mb-2.5 translate-y-14 opacity-0 group-hover/icons:opacity-100 group-hover/icons:translate-y-0 group-hover/icons:delay-[.2s] duration-[0.6s]"
          >
            <div className="w-10 h-10 border bg-white border-[#323232] center cursor-pointer bg-transparent">
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
            <div className="w-10 h-10 border bg-white border-[#323232] center cursor-pointer bg-transparent">
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
            <div className="w-10 h-10 border bg-white border-[#323232] center cursor-pointer bg-transparent">
              {itemInCart() ? (
                <AiFillCheckCircle className="text-xl z-10 group-hover:text-white transition-all duration-500 delay-200" />
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
      <div className="px-4 mt-[22px] text-primary group hover:!text-text-hover">
        <Link
          href={`/shop/${data.shopId}`}
          className="inline-block mb-1 font-medium text-white text-xs bg-blue-600 rounded-md py-1 px-2"
        >
          {data.shop.name}
        </Link>
        <Link
          href={`/product/${data._id}`}
          className="leading-[20px] text-inherit block truncate font-semibold text-sm"
        >
          {truncate(data.name, 40)}
        </Link>
        <p className="my-2 flex flex-wrap gap-y-3">
          <span className="text-inherit leading-5 font-semibold mr-3">
            {currencyConverter(data.discountPrice)}
          </span>
          <sup className="text-red-500 line-through leading-5 text-sm tracking-tight ">
            {currencyConverter(data.originalPrice)}
          </sup>
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Rating
            name="read-only"
            value={data?.ratings ?? null}
            precision={0.5}
            readOnly
            size="small"
            className=""
          />
          {data.stock < 1 ? (
            <span className="text-red-600 font-semibold text-sm">
              Out of Stock
            </span>
          ) : (
            <p className="text-green-500 font-medium text-sm">
              {data.sold_out} sold {""}
              <span className={`${data.stock < 3 && "text-red-500"}`}>
                ({data.stock}) left
              </span>
            </p>
          )}
        </div>
        <div className="flex lg:hidden gap-3 justify-center mt-3">
          <button
            onClick={handleWishlist}
            className={`${
              itemInWishlist()
                ? "border-text-hover text-text-hover"
                : "border-[#d7d7d7]"
            } w-[40px] h-[40px] text-lg center border hover:border-text-hover rounded-[5px]`}
          >
            {itemInWishlist() ? (
              <AiFillHeart className="text-text-hover" />
            ) : (
              <AiOutlineHeart />
            )}
          </button>
          <button
            onClick={() => handleCart(data._id)}
            className={`${
              itemInCart()
                ? "border-text-hover text-text-hover"
                : "border-[#d7d7d7]"
            } w-[40px] h-[40px] text-lg center border hover:border-text-hover rounded-[5px]`}
          >
            {itemInCart() ? <BsBagCheckFill /> : <BsCart3 />}
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
                  className="h-full w-full py-5 !flex items-center bg-[#f4f4f4] relative"
                >
                  <Image
                    key={i}
                    src={img.url}
                    alt=""
                    fill
                    priority
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
            <div className="sm:px-[35px]">
              <div className="mb-[30px] flex gap-5 items-center">
                <div className="text-primary flex gap-1">
                  <Rating
                    name="read-only"
                    value={data?.ratings ?? null}
                    precision={0.5}
                    readOnly
                    size="medium"
                    className=""
                  />
                </div>
                <Link href="#" className="underline decoration-1 text-primary">
                  {data.reviews.length < 1 ? "No" : data.reviews.length} reviews
                </Link>
              </div>
              <div className="text-primary">
                <Link
                  href={`product/${data._id}`}
                  className="block text-2xl font-medium text-inherit mb-5"
                >
                  {data.name}
                </Link>
                <div className="flex items-center mb-5 text-lg font-semibold">
                  <p className="mr-4">
                    {currencyConverter(data.discountPrice)}
                  </p>
                  <sup className="line-through text-red-400 text-sm ">
                    {currencyConverter(data.originalPrice)}
                  </sup>
                </div>
                <p
                  className="mb-5 text-sm leading-[26px] tracking-[0.5px]"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                ></p>
                <div className="mb-[27px]">
                  <QtyButton data={data} itemInCart={itemInCart} />
                  {data.stock < 1 ? (
                    <p className="text-red-500 mt-2 font-medium text-sm">
                      Out of stock
                    </p>
                  ) : null}
                </div>
                <div className="mb-3">
                  <p className="mb-2">
                    <span className="font-medium">Categories: </span>{" "}
                    {data.category}
                  </p>
                  <p>
                    <span className="font-medium">Tags: </span>
                    {data.tags ? data.tags.split(" ").join(", ") : null}
                  </p>
                </div>
                <div className="">
                  <div className="flex items-center mb-4">
                    <Image
                      src={data.shop.avatar.url}
                      alt=""
                      width={40}
                      height={40}
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
                  <div className="mt-3">
                    {data.stock < 1 ? (
                      <span className="text-red-600 font-semibold text-sm">
                        Out of Stock
                      </span>
                    ) : (
                      <p className="text-green-500 font-medium text-sm">
                        {data.sold_out} sold {""}
                        <span className={`${data.stock < 3 && "text-red-500"}`}>
                          ({data.stock}) left
                        </span>
                      </p>
                    )}
                  </div>
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
