import React, { useState } from "react";
import { BiLoader } from "react-icons/bi";
import { PaystackButton } from "react-paystack";

interface IProps {
  cashOnDeliveryHandler: any;
  loading: boolean;
  order: any;
  paystackPaymentHandler: any;
}

function PaymentInfo({
  cashOnDeliveryHandler,
  loading,
  order,
  paystackPaymentHandler,
}: IProps) {
  const [select, setSelect] = useState(1);
  const options = {
    email: order?.user?.email,
    // amount: order.totalPrice * 100,
    amount: 20 * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_SECRET_PUBLIC ?? "",
    text: "Pay Now",
    onSuccess: paystackPaymentHandler,
  };
  return (
    <div className="w-full bg-white rounded-md p-5">
      <div>
        <div
          className="flex w-full pb-5 border-b cursor-pointer"
          onClick={() => setSelect(1)}
        >
          <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center">
            {select === 1 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Pay with Paystack
          </h4>
        </div>
        {select === 1 ? (
          <div className="w-full flex border-b">
            <PaystackButton
              className="w-[150px] my-4 flex items-center justify-center bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]"
              {...options}
            />
          </div>
        ) : null}
      </div>
      <div>
        <div
          onClick={() => setSelect(2)}
          className="flex w-full py-5 border-b cursor-pointer"
        >
          <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center">
            {select === 2 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
            Cash on Delivery
          </h4>
        </div>

        {/* cash on delivery */}
        {select === 2 ? (
          <div className="w-full flex">
            <form className="w-full" onSubmit={cashOnDeliveryHandler}>
              <button
                type="submit"
                className="w-[150px] mt-4 flex items-center justify-center !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]"
              >
                {loading && <BiLoader className="text-xl mr-2 animate-spin" />}
                Confirm
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PaymentInfo;
