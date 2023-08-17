"use client";
import { useAppDispatch } from "@/redux/hook";
import { addToCart, removeFromCart } from "@/redux/slices/cartSlice";
import { removeFromWishlist } from "@/redux/slices/wishlistSlice";
import { currencyConverter, truncate } from "@/utils/helperFunc";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsCartPlus } from "react-icons/bs";
import { toast } from "react-toastify";

function ProductItem({
  type = "cart",
  product,
}: {
  type?: string;
  product: Product;
}) {
  const [value, setValue] = useState(product?.qty ?? 0);
  const dispatch = useAppDispatch();

  const increment = () => {
    if (product.stock <= value) {
      toast.error("Product is out of stock");
    } else {
      setValue(value + 1);
      const updateCartData = { ...product, qty: value + 1 };
      dispatch(addToCart(updateCartData));
    }
  };

  const decrement = () => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...product, qty: value === 1 ? 1 : value - 1 };
    dispatch(addToCart(updateCartData));
  };
  const handleRemove = () => {
    if (type === "cart") {
      dispatch(removeFromCart(product._id));
    } else {
      dispatch(removeFromWishlist(product._id));
    }
  };

  const handleAddToCart = () => {
    if (product.stock < 1) {
      toast.error("Product is out of stock");
    } else {
      const updateCartData = { ...product, qty: 1 };
      dispatch(addToCart(updateCartData));
      dispatch(removeFromWishlist(product._id));
      toast.success("Product added to cart");
    }
  };
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-4">
        {type === "cart" ? (
          <div className="flex flex-col items-center">
            <button
              onClick={increment}
              className="flex justify-center items-center rounded-full h-6 w-6 bg-red-600 shadow-md text-white"
            >
              <AiOutlinePlus className="text-white text-lg" />
            </button>
            <span className="font-medium">{product.qty}</span>
            <button
              onClick={decrement}
              className="flex justify-center items-center rounded-full h-6 w-6 bg-slate-200 text-white"
            >
              <AiOutlineMinus className="text-primary text-lg" />
            </button>
          </div>
        ) : null}
        <img
          src={product.images[0].url}
          alt=""
          className="w-[80px] h-[80px] object-contain"
        />
        <div className="">
          <Link
            href="#"
            className="text-sm font-medium mb-1 leading-normal inline-block"
          >
            {truncate(product.name)}
          </Link>
          <p className="text-sm">
            {type === "cart"
              ? `${currencyConverter(product.discountPrice)} x ${product.qty}`
              : currencyConverter(product.discountPrice)}
          </p>
          {type === "cart" ? (
            <p className="text-base text-red-600 font-bold">
              {currencyConverter(product.discountPrice * product.qty)}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center w-full justify-between gap-4 mt-3">
        <button
          onClick={handleRemove}
          className="text-red-600 font-medium text-sm"
        >
          Remove
        </button>
        {type === "wishlist" ? (
          <button
            onClick={handleAddToCart}
            className="font-medium text-sm flex items-center bg-green-500 text-white px-2.5 py-2 rounded-md"
          >
            Add to cart <BsCartPlus className="text-xl ml-2" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default ProductItem;
