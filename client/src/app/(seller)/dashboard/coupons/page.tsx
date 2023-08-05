import CouponTable from "@/components/dashboard/tables/CouponTable";
import CustomButton from "@/components/form/CustomButton";
import React from "react";

function page() {
  const rows = [] as any;

  // coupouns &&
  // coupouns.forEach((item) => {
  //     row.push({
  //       id: item._id,
  //       name: item.name,
  //       price: item.value + " %",
  //       sold: 10,
  //     });
  //   });
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Coupons</h2>
        <CustomButton text="Create Coupon" />
      </div>
      <div className="mt-4 bg-white rounded-md shadow-sm w-full h-full">
        <CouponTable rows={rows} />
      </div>
    </div>
  );
}

export default page;
