import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import Products from "@/components/Products";
import { getAllProducts } from "@/services/product";
import React from "react";

export default async function page() {
  const data: Product[] = await getAllProducts();
  return (
    <div className="mt-[70px] min-h-[calc(100vh-409px)] bg-[#f4f4f4] min-w-full">
      <CustomBreadCrumb />
      <div className="container px-4">
        <Products data={data} />
      </div>
    </div>
  );
}
