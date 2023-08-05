import IconButton from "@mui/material/IconButton";
import React, { useMemo, useState } from "react";
import { BsCart4, BsHandbag } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import ProductItem from "./ProductItem";
import Drawer from "./modals/Drawer";
import { useAppSelector } from "@/redux/hook";
import CustomButton from "./form/CustomButton";
import { currencyConverter } from "@/utils/helperFunc";
import Link from "next/link";

interface IProps {
  toggleModal: () => void;
  showCart: boolean;
}

function CartDrawer({ toggleModal, showCart }: IProps) {
  const { cart } = useAppSelector((state) => state.cart);

  const totalPrice = useMemo(
    () => cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0),
    [cart]
  );
  return (
    <Drawer
      anchor="right"
      open={showCart}
      toggleModal={toggleModal}
      width={350}
      showCloseBtn={false}
    >
      <div className="">
        <div className="bg-white z-10 py-7 flex items-center justify-between border-b border-borderCol px-4 sticky top-0 w-full">
          <div className="flex items-center">
            <BsHandbag className="mr-2 text-3xl" />
            <span className="font-medium text-base">{cart.length} Items</span>
          </div>

          <IconButton onClick={toggleModal} className="">
            <MdClose />
          </IconButton>
        </div>
        <div className="h-[calc(100vh-97px)] px-4 pt-6 pb-4 relative">
          {cart.length > 0 ? (
            <div className="h-[calc(100vh-298px)] overflow-y-auto">
              {cart.map((product) => (
                <ProductItem key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="w-full h-[calc(100%-129px)]">
              <div className="w-full min-h-[200px]  flex flex-col justify-center items-center mt-[40%] px-4">
                <p className="text-center mb-2">Cart Empty</p>
                <div className="h-[80px] w-[80px] rounded-full bg-gray-200 flex justify-center items-center">
                  <BsCart4 className="text-black/40" size={30} />
                </div>
              </div>
            </div>
          )}
          {cart.length > 0 ? (
            <div className="sticky bottom-0 w-full py-4 bg-white border-t border-borderCol">
              <p className="flex justify-between font-semibold mb-3">
                Subtotal:{" "}
                <span className="text-primary text-lg">
                  {currencyConverter(totalPrice)}
                </span>
              </p>
              <Link href="/checkout">
                <CustomButton
                  handleClick={toggleModal}
                  text="Checkout"
                  extraClass="w-full"
                />
              </Link>
              <Link href="#">
                <CustomButton text="View Cart" extraClass="w-full mt-2" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </Drawer>
  );
}

export default CartDrawer;
