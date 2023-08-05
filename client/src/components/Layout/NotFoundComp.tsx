import Link from "next/link";
import React from "react";
import CustomButton from "../form/CustomButton";

function NotFoundComp({ href }: { href: string }) {
  return (
    <div className="bg-[#fff] h-[calc(100vh-70px)] flex justify-center">
      <div className="mt-[15%] text-center">
        <h2 className="text-5xl font-semibold">Not Found</h2>
        <p className="my-3">Could not find requested resource</p>
        <Link href={href} className="inline-block mx-auto">
          <CustomButton text="homepage" />
        </Link>
      </div>
    </div>
  );
}

export default NotFoundComp;
