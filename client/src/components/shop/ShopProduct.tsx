"use client";
import React, { useState } from "react";
import Product from "../Product";
import { AiOutlineFileSearch } from "react-icons/ai";
import CustomPagination from "../Layout/CustomPagination";
import { useRouter } from "next/navigation";

interface IProps {
  data: {
    products: Product[];
    totalPages: number;
    totalRecord: number;
  };
  id: string;
}
function ShopProduct({ id, data }: IProps) {
  const [filter, setFilter] = useState("");
  const router = useRouter();

  const products: Product[] = data?.products;
  const totalRecord = data?.totalRecord;

  const handleFilter = (e: any) => {
    const v = e.target.value;
    setFilter(v);
    router.push(`/shop/${id}?sort=${v}`);
  };
  const handleChangePage = async (e: any, page: any) => {
    router.push(`/shop/${id}?page=${page}`);
  };
  return (
    <div className="rounded-md flex-1 overflow-y-auto h-[calc(100vh-110px)] bg-white relative hide-scroll">
      <div className="z-[30] min-h-[60px] bg-white sticky top-0 flex flex-wrap gap-3 justify-between items-center border-b border-solid border-gray-200/70 py-2 px-3">
        <p className="text-sm font-medium my-2">({totalRecord}) Products</p>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm font-semibold">Sort By:</span>
          <select
            value={filter}
            onChange={handleFilter}
            className="border border-form-border focus:outline-none rounded-none px-2 py-1.5 min-w-[140px]"
          >
            <option value="">Select</option>
            <option value="discountPrice">Price: Low to High</option>
            <option value="-discountPrice">Price: High to Low</option>
            <option value="-createdAt">Newest Arrivals</option>
          </select>
        </div>
      </div>
      <div className="relative">
        {products && products.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 w-full p-3">
            {products.map((product) => (
              <Product data={product} key={product._id} />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-fit flex flex-col items-center justify-center text-center my-10">
              <AiOutlineFileSearch className="text-6xl mb-3 text-black/40" />
              <p className="text-xl font-semibold text-primary/60">
                Product not found
              </p>
            </div>
          </div>
        )}
        <CustomPagination data={data} handleChangePage={handleChangePage} />
      </div>
    </div>
  );
}

export default ShopProduct;
