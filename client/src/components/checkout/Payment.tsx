"use client";
import React, { useEffect, useState } from "react";
import TextField from "../form/TextField";
import { useForm } from "react-hook-form";
import { useAppSelector } from "@/redux/hook";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CountrySelect from "../form/CountrySelect";
import StateSelect from "../form/SateSelect";
import { toast } from "react-toastify";
import CustomButton from "../form/CustomButton";
import Coupon from "./Coupon";
import { useRouter } from "next/navigation";
import PaymentInfo from "./PaymentInfo";
import { baseUrl } from "@/server";

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

interface IOrder {
  cart: any;
  shippingAddress: any;
  user: any;
  totalPrice: any;
  paymentInfo: {
    id?: string;
    type?: string;
    status?: string;
  } | null;
}

function Payment() {
  const { user } = useAppSelector((state) => state.user);
  const { cart } = useAppSelector((state) => state.cart);
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setloading] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder") ?? "");
    setOrderData(orderData);
  }, []);

  const order: IOrder = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
    paymentInfo: null,
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // this is shipping cost variable
  const shipping = subTotalPrice * 0.1;

  // Discount percentage
  const discountPercentenge: any = couponCodeData ? discountPrice : "";

  // Total price
  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : parseFloat((subTotalPrice + shipping).toFixed(2));

  const cashOnDeliveryHandler = async (e: any) => {
    e.preventDefault();
    setloading(true);

    order.paymentInfo = {
      type: "Cash On Delivery",
    };

    const res = await fetch(`${baseUrl}/order/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    setloading(false);

    if (res.ok) {
      router.push("/order/success");
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      // window.location.reload();
    } else {
      toast.error("something went wrong, try again");
    }
  };
  return (
    <div className="flex gap-5 my-10 flex-col lg:flex-row">
      <div className="flex-1">
        <PaymentInfo
          loading={loading}
          user={user}
          cashOnDeliveryHandler={cashOnDeliveryHandler}
        />
      </div>
      <div className="hidden lg:block w-full lg:w-[30%]">
        <Coupon />
      </div>
    </div>
  );
}

export default Payment;
