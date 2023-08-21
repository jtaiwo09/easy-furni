"use client";
import React, { useState } from "react";
import { BsCartPlus, BsChevronDown, BsChevronUp } from "react-icons/bs";
import CustomButton from "./form/CustomButton";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/hook";
import { addToCart } from "@/redux/slices/cartSlice";

function QtyButton({ data, itemInCart }: any) {
  const dispatch = useAppDispatch();
  const [qty, setQty] = useState<any | number | string>(1);
  const handleQuantity = (str: string) => {
    if (str === "inc") {
      if (data.stock < 1) {
        toast.error("Product is out of stock");
      } else if (qty >= data.stock) {
        toast.error(`Only ${qty} product(s) is left`);
      } else {
        setQty((prev: any) => Number(prev) + 1);
      }
    } else {
      if (qty > 1) {
        setQty((prev: any) => Number(prev) - 1);
      }
    }
  };

  const setQuantity = (e: any) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value != 0) {
      setQty(value);
    } else {
      setQty("");
    }
  };
  const handleCart = () => {
    if (data.stock < 1) {
      toast.error("Product out of stock");
    } else {
      const updateCartData = { ...data, qty: qty };
      dispatch(addToCart(updateCartData));
      if (itemInCart()) {
        toast.success("Item has been updated");
      } else {
        toast.success("Item added to cart");
      }
    }
  };
  return (
    <div className="flex gap-3 w-fit">
      <div className="flex border border-[rgba(215,215,215,1)] w-[85px]">
        <input
          type="text"
          value={qty}
          onChange={setQuantity}
          className="appearance border-none w-full focus:outline-none text-center font-medium"
        />

        <div className="w-[50%] h-full">
          <button
            onClick={() => handleQuantity("inc")}
            className="h-1/2 flex justify-center items-center w-full cursor-pointer"
          >
            <BsChevronUp />
          </button>

          <button
            onClick={() => handleQuantity("dec")}
            className="h-1/2 flex justify-center items-center w-full cursor-pointer"
          >
            <BsChevronDown />
          </button>
        </div>
      </div>
      <CustomButton
        handleClick={handleCart}
        text="Add to cart"
        extraClass="w-full sm:w-fit"
      >
        <BsCartPlus className="ml-2 text-lg" />
      </CustomButton>
    </div>
  );
}

export default QtyButton;
