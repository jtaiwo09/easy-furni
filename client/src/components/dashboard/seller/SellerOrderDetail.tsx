"use client";
import CustomButton from "@/components/form/CustomButton";
import { updateOrderStatus } from "@/services/order";
import { currencyConverter } from "@/utils/helperFunc";
import { Country, State } from "country-state-city";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

function SellerOrderDetail({ order, id }: { order: Order; id: string }) {
  const [status, setStatus] = useState("");
  const router = useRouter();

  const orderUpdateHandler = async () => {
    try {
      await updateOrderStatus({ id, status });
      toast.success("Order has been updated!");
      router.refresh();
      router.push("/dashboard/orders");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="py-10">
      {order.cart.map((item) => (
        <div
          key={item._id}
          className="py-10 border-b border-form-border flex items-center space-x-5"
        >
          <img
            src={`${item.images[0]?.url}`}
            alt=""
            className="w-[80x] h-[80px]"
          />
          <div className="w-full">
            <h5 className=" text-xl mb-1 ">{item.name}</h5>
            <p className="font-semibold text-gray-600 text-lg">{`${currencyConverter(
              item.discountPrice
            )} x ${item.qty}`}</p>
          </div>
        </div>
      ))}
      <p className="mt-3 text-[18px] text-right">
        Total Price: <strong>{currencyConverter(order.totalPrice)}</strong>
      </p>
      <br />
      <div className="w-full lg:flex">
        <div className="w-full lg:w-[60%]">
          <h4 className="text-[20px] font-[600]">Shipping Address:</h4>
          <div className="text-lg">
            <h4 className="pt-2">{order?.shippingAddress.address}</h4>
            <h4>
              {Country.getCountryByCode(order?.shippingAddress.country)?.name}
            </h4>
            <h4>
              {
                State.getStateByCodeAndCountry(
                  order?.shippingAddress.state,
                  order?.shippingAddress.country
                )?.name
              }
            </h4>
            <h4>{order?.user?.phoneNumber}</h4>
          </div>
        </div>
        <div className="w-full lg:w-[40%]">
          <h4 className="text-[20px] font-[600]">Payment Info:</h4>
          <h4>
            Status:{" "}
            {order?.paymentInfo?.status
              ? order?.paymentInfo?.status
              : "Not Paid"}
          </h4>
        </div>
      </div>
      <br />
      {order.status === "Processing refund" ||
      order.status === "Refund Success" ? (
        <>
          <h4 className="text-[20px] font-[600]">Refund Status:</h4>
          <p>{order.status}</p>
        </>
      ) : null}
      <br />
      <h4 className="text-[20px] font-[600] mb-2">Order Status:</h4>
      {order?.status !== "Processing refund" &&
        order?.status !== "Refund Success" && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className=" border border-borderCol h-[46px] w-full sm:min-w-[140px] sm:max-w-fit rounded-none px-5 focus:outline-none"
          >
            {order?.status === "Delivered" ? (
              <option value="Delivered">Delivered</option>
            ) : (
              [
                "Processing",
                "Transferred to delivery partner",
                "Shipping",
                "Received",
                "On the way",
              ]
                .slice(
                  [
                    "Processing",
                    "Transferred to delivery partner",
                    "Shipping",
                    "Received",
                    "On the way",
                  ].indexOf(order?.status!)
                )
                .map((option, index) => (
                  <option value={option} key={index}>
                    {option}
                  </option>
                ))
            )}
          </select>
        )}
      {order?.status === "Processing refund" ||
      order?.status === "Refund Success" ? (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[46px] rounded-[5px]"
        >
          {["Processing refund", "Refund Success"]
            .slice(
              ["Processing refund", "Refund Success"].indexOf(order?.status)
            )
            .map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
        </select>
      ) : null}
      {order?.status !== "Delivered" ? (
        <CustomButton
          text="Update Status"
          extraClass="mt-4"
          handleClick={orderUpdateHandler}
        />
      ) : null}
    </div>
  );
}

export default SellerOrderDetail;
