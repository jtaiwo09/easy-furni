import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import Payment from "@/components/checkout/Payment";
import React from "react";

function page() {
  return (
    <div className="mt-[70px] min-h-[calc(100vh-409px)] bg-[#f4f4f4]">
      <CustomBreadCrumb />
      <div className="container px-4 ">
        <CheckoutSteps active={2} />
        <Payment />
      </div>
    </div>
  );
}

export default page;
