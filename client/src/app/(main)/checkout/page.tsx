import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import Checkout from "@/components/checkout/Checkout";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import React from "react";

function page() {
  return (
    <div className="mt-[70px] min-h-[calc(100vh-409px)] bg-[#f4f4f4]">
      <CustomBreadCrumb />
      <div className="container px-4 ">
        <CheckoutSteps active={1} />
        <Checkout />
      </div>
    </div>
  );
}

export default page;
