"use client"; // Error components must be Client Components

import CustomButton from "@/components/form/CustomButton";
import { useEffect } from "react";
import { BiErrorCircle } from "react-icons/bi";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex justify-center items-center flex-1 h-full bg-[#f4f4f4] min-h-[500px]">
      <div className="max-w-[400px] w-[80%] bg-white rounded-md p-5 h-fit shadow-md">
        <BiErrorCircle size={50} className="text-primary mb-5 mx-auto" />
        <h2 className="text-center my-5 font-semibold text-base">
          Something went wrong!
        </h2>
        <CustomButton
          text="Try again"
          handleClick={() => reset()}
          extraClass="mx-auto w-full sm:w-fit"
        />
      </div>
    </div>
  );
}
