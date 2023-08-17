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
import { useRouter } from "next/navigation";
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

function Checkout() {
  const { user } = useAppSelector((state) => state.user);
  const { cart } = useAppSelector((state) => state.cart);
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [couponCode, setCouponCode] = useState("");

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

  const handleDefaultAddress = (e: any) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const defaultAddress = user?.addresses.find(
        (address) => address.default === true
      );
      if (defaultAddress) {
        setValue("phoneNumber", defaultAddress.phoneNumber);
        setValue("address", defaultAddress.address);
        setValue("country", defaultAddress.country);
        setValue("state", defaultAddress.state);
      } else {
        router.push("/address");
        toast.error("Please set a default address");
      }
    } else {
      reset();
    }
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
    ? subTotalPrice + shipping - discountPercentenge
    : parseFloat((subTotalPrice + shipping).toString());

  useEffect(() => {
    setOrderData({
      totalPrice,
      shipping,
      subTotalPrice,
      couponCode,
      setCouponCode,
      discountPercentenge,
    });
  }, []);

  const handleCheckout = (data: CheckoutFormData) => {
    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      shipping,
      discountPrice,
      shippingAddress: data,
      user,
    };

    // update local storage with the updated orders array
    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    router.push("/payment");
  };
  return (
    <div className="flex gap-5 my-10 flex-col lg:flex-row">
      <div className="flex-1">
        <form onSubmit={handleSubmit(handleCheckout)}>
          <div className="w-full bg-white rounded-md p-4">
            <h2 className="text-xl font-semibold mb-10">Shipping Address</h2>
            <div className="flex flex-col sm:flex-row sm:gap-4 mb-0 sm:mb-4">
              <TextField
                name="name"
                label="Full Name"
                inputClass="leading-[24px]"
                formGroup=" mb-4 sm:mb-0 w-full"
                register={register}
                errors={errors}
              />
              <TextField
                name="email"
                label="Email Address"
                inputClass="leading-[24px]"
                formGroup=" mb-4 sm:mb-0 w-full"
                register={register}
                errors={errors}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4 mb-0 sm:mb-4">
              <TextField
                name="phoneNumber"
                label="Phone Number"
                inputClass="leading-[24px]"
                formGroup=" mb-4 sm:mb-0 w-full"
                register={register}
                errors={errors}
              />
              <TextField
                name="address"
                label="Address"
                inputClass="leading-[24px]"
                formGroup=" mb-4 w-full"
                register={register}
                errors={errors}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4 mb-0 sm:mb-4">
              <CountrySelect
                label="Select Country"
                name="country"
                formGroup=" mb-4 w-full"
                register={register}
                errors={errors}
              />
              <StateSelect
                label="Select State"
                name="state"
                formGroup=" mb-4 w-full"
                isoCode={watch("country")}
                register={register}
                errors={errors}
                control={control}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="default"
                onChange={handleDefaultAddress}
              />
              <label htmlFor="default" className="inline-block ml-4">
                Use default address{" "}
              </label>
            </div>
          </div>
          <div className="lg:hidden mt-5">
            <CartSummary orderData={orderData} />
          </div>
          <CustomButton
            type="submit"
            text="Go to payment"
            extraClass="ml-auto mt-10 min-w-full sm:min-w-[200px]"
          />
        </form>
      </div>
      <div className="hidden lg:block w-full lg:w-[30%]">
        <CartSummary orderData={orderData} />
      </div>
    </div>
  );
}

export default Checkout;
