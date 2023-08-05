import React from "react";

const CheckoutSteps = ({ active }: { active: number }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-fit flex items-center flex-wrap">
        <div className="flex items-center">
          <div className="px-[20px] h-[38px] rounded-[20px] bg-[#f63b60] flex items-center justify-center cursor-pointer">
            <span className="text-[#fff] text-[16px] font-[600]">
              1.Shipping
            </span>
          </div>
          <div
            className={`${
              active > 1
                ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f63b60]"
                : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#FDE1E6]"
            }`}
          />
        </div>

        <div className="flex items-center">
          <div
            className={`px-[20px] h-[38px] rounded-[20px] bg-[#f63b60] flex items-center justify-center cursor-pointer ${
              active > 1 ? "" : "!bg-[#FDE1E6]"
            }`}
          >
            <span
              className={`text-[#fff] text-[16px] font-[600] ${
                active > 1 ? "" : "!text-[#f63b60]"
              }`}
            >
              2.Payment
            </span>
          </div>
          <div
            className={`${
              active > 2
                ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f63b60]"
                : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#FDE1E6]"
            }`}
          />
        </div>

        <div className="flex items-center">
          <div
            className={`px-[20px] h-[38px] rounded-[20px] bg-[#f63b60] flex items-center justify-center cursor-pointer ${
              active > 2 ? "" : "!bg-[#FDE1E6]"
            }`}
          >
            <span
              className={`text-[#fff] text-[16px] font-[600] ${
                active > 2 ? "" : "!text-[#f63b60]"
              }`}
            >
              3.Success
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
