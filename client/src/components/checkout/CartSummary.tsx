import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import TextField from "../form/TextField";
import CustomButton from "../form/CustomButton";
import { currencyConverter } from "@/utils/helperFunc";

interface CouponFormData {
  coupon: string;
}

const schema = yup.object().shape({
  coupon: yup.string().required("Coupon is required"),
});

function CartSummary({ orderData }: any) {
  const shipping = orderData?.shipping?.toFixed(2);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CouponFormData>({
    defaultValues: {
      coupon: "",
    },
    resolver: yupResolver(schema),
  });

  const handleCoupon = (data: CouponFormData) => {
    //
  };
  return (
    <div className="w-full bg-white rounded-md py-6 px-4 h-fit">
      <p className="flex mb-3 justify-between">
        <span className="inline-block">Subtotal:</span>
        <span className="font-semibold text">
          {currencyConverter(orderData?.subTotalPrice)}
        </span>
      </p>
      <p className="flex mb-3 justify-between">
        <span className="inline-block">Shipping:</span>
        <span className="font-semibold text">
          {currencyConverter(shipping)}
        </span>
      </p>
      <p className="flex mb-3 justify-between">
        <span className="inline-block">Discount:</span>
        <span className="font-semibold text">
          {orderData?.discountPrice ? orderData?.discountPrice : "-"}
        </span>
      </p>
      <hr />
      <p className="flex my-3 justify-between">
        <span className="inline-block">Total:</span>
        <span className="font-semibold text">
          {currencyConverter(orderData?.totalPrice)}
        </span>
      </p>
      <form onSubmit={handleSubmit(handleCoupon)}>
        <TextField
          name="coupon"
          label="Enter Coupon"
          inputClass="leading-[24px]"
          formGroup="w-full"
          register={register}
          errors={errors}
        />
        <CustomButton
          text="Apply Coupon"
          type="submit"
          extraClass="mt-4 w-full"
        />
      </form>
    </div>
  );
}

export default CartSummary;
