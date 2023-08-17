"use client";
import CustomButton from "@/components/form/CustomButton";
import Link from "next/link";
import React from "react";
import { BsChevronLeft, BsFillBagFill } from "react-icons/bs";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import UserOrderDetail from "@/components/Order/UserOrderDetail";
import { getUserOrder } from "@/services/swr/order";
import Loader from "@/components/Layout/Loader";
import { toast } from "react-toastify";

export default function page() {
  const params = useParams();
  const orderId = params.id;
  const { data, error, isLoading } = getUserOrder(orderId);
  const order = data?.order;

  if (isLoading) return <Loader />;
  if (error) {
    toast.error(error.message);
  }
  if (order)
    return (
      <div className="bg-[#f4f4f4] pt-[70px]">
        <div className="container h-full px-5">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center">
              <BsFillBagFill className="text-text-hover text-3xl" />
              <p className="text-2xl ml-2 font-medium">Order Details</p>
            </div>
            <Link href="/orders">
              <CustomButton position="start" text="back to order">
                <BsChevronLeft className="text-lg" />
              </CustomButton>
            </Link>
          </div>
          <div className="flex justify-between items-center my-2 text-gray-600">
            <p>
              <span className="font-semibold"> Order Id: </span> #
              {order?._id?.slice(0, 8).toUpperCase()}
            </p>
            <p>
              <span className="font-semibold"> Placed On: </span>
              {dayjs(order.createdAt).format("MMM D, YYYY")}
            </p>
          </div>
          <UserOrderDetail id={orderId} order={order} />
        </div>
      </div>
    );
}
