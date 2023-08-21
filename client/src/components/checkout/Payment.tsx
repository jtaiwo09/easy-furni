"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector } from "@/redux/hook";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import PaymentInfo from "./PaymentInfo";
import { baseUrl } from "@/server";
import CartSummary from "./CartSummary";

export interface CheckoutFormData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  country: any;
  state: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Must be a valid email address")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number")
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
});

function Payment() {
  const { user } = useAppSelector((state) => state.user);
  const { cart } = useAppSelector((state) => state.cart);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder") ?? "");
    setOrderData(orderData);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      country: "",
      state: "",
    },
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      address: "",
      country: "",
      state: "",
    },
    resolver: yupResolver(schema),
  });

  const order: any = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user,
    totalPrice: orderData?.totalPrice,
    shipping: orderData?.shipping,
    paymentInfo: null,
  };

  const createOrder = async () => {
    const res = await fetch(`${baseUrl}/order/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    const result = await res.json();
    setLoading(false);
    if (res.ok) {
      router.push("/order/success");
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
    } else {
      toast.error(result.message);
    }
  };

  const cashOnDeliveryHandler = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    order.paymentInfo = {
      type: "Cash On Delivery",
      paid: false,
    };

    await createOrder();
  };

  const paystackPaymentHandler = (res: any) => {
    if (res.status === "success") {
      order.paymentInfo = {
        id: res.trans,
        ref: res.trxref,
        status: res.status,
        type: "Paystack",
        paid: true,
      };
      createOrder();
    }
  };

  if (cart.length === 0) {
    redirect("/");
  }

  return (
    <div className="flex gap-5 my-10 flex-col lg:flex-row">
      <div className="flex-1">
        <PaymentInfo
          loading={loading}
          order={order}
          paystackPaymentHandler={paystackPaymentHandler}
          cashOnDeliveryHandler={cashOnDeliveryHandler}
        />
      </div>
      <div className="hidden lg:block w-full lg:w-[30%]">
        <CartSummary orderData={orderData} />
      </div>
    </div>
  );
}

export default Payment;
