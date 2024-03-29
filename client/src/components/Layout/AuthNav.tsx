import Link from "next/link";
import React from "react";

function AuthNav() {
  return (
    <div className="bg-white align-center h-[70px] flex justify-center border-b border-solid border-borderCol sticky top-0 z-[99]">
      <Link href="/" className="uppercase inline-block font-semibold text-2xl">
        JTK STORE
      </Link>
    </div>
  );
}

export default AuthNav;
