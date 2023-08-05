import CustomButton from "@/components/form/CustomButton";
import Link from "next/link";
import React from "react";
import { BsChevronLeft, BsFillBagFill } from "react-icons/bs";
import dayjs from "dayjs";
import { notFound } from "next/navigation";
import UserOrderDetail from "@/components/Account/Order/UserOrderDetail";
import { getUserOrder } from "@/services/serverApi/user";

export default async function page({ params }: { params: { id: string } }) {
  const orderId = params.id;
  const res = await getUserOrder(orderId);
  const order = res.order;

  if (!order) notFound();
  return (
    <div className="bg-[#f4f4f4] pt-[70px]">
      <div className="container h-full px-5">
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center">
            <BsFillBagFill className="text-text-hover text-3xl" />
            <p className="text-2xl ml-2 font-medium">Order Details</p>
          </div>
          <Link href="/profile?tab=orders">
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
