import Main from "@/components/Account/Main";
import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import Sidebar from "@/components/Layout/Sidebar";
import React from "react";

function page() {
  return (
    <div className="pt-[70px] bg-[#F5F5F5] min-h-[70vh]">
      <CustomBreadCrumb />
      <div className="px-[30px] lg:px-[50px] ">
        <div className="container flex gap-4 mb-5">
          <Sidebar />
          <Main />
        </div>
      </div>
    </div>
  );
}

export default page;
