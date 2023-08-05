import CustomButton from "@/components/form/CustomButton";
import React from "react";

function page() {
  return (
    <div className="h-full w-full bg-white rounded-md flex justify-center items-center">
      <div className="w-fit">
        <h2 className="mb-5 font-medium text-xl">
          Available Balance: $1188.00
        </h2>
        <CustomButton text="Withdraw" extraClass="mx-auto" />
      </div>
    </div>
  );
}

export default page;
