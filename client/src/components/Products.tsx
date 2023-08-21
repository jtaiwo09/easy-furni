"use client";
import React, { useState } from "react";
import ProductFilter from "./ProductFilter";
import Product from "./Product";
import { AiOutlineFileSearch } from "react-icons/ai";
import { useRouter, useSearchParams } from "next/navigation";
import { toggleFilter } from "@/redux/slices/productSlice";
import { useAppDispatch } from "@/redux/hook";
import CustomPagination from "./Layout/CustomPagination";
import LinearProgress from "@mui/material/LinearProgress";

function Products({ data }: { data: any }) {
  const products: Product[] = data?.products ?? [];
  const [filter, setFilter] = useState("");
  const [filterObject, setFilterObject] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleFilter = (e: any) => {
    const v = e.target.value;
    setFilter(v);
    const params = { ...filterObject, sort: v };
    setFilterObject(params);
    const urlParams = new URLSearchParams(params).toString();
    router.push(`/product?${urlParams}`);
  };

  const handleChangePage = async (e: any, page: any) => {
    const urlParams = new URLSearchParams(filterObject).toString();
    router.push(`/product?${urlParams}${urlParams ? "&" : ""}page=${page}`);
  };

  return (
    <div className="relative">
      <div className="flex gap-4 mb-10 relative">
        <ProductFilter
          filterObject={filterObject}
          setFilterObject={setFilterObject}
        />
        <div className="w-full h-full">
          {loading && <LinearProgress />}
          <div className="w-full h-full bg-white rounded-md">
            <div className="h-full flex flex-wrap gap-3 justify-between items-center border-b border-solid border-gray-200/60 py-2 px-3">
              <p className="text-sm font-medium my-2">
                ({products.length}) Products
              </p>
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
            {products && products.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 w-full p-3">
                {products.map((product) => (
                  <Product data={product} key={product._id} />
                ))}
              </div>
            ) : (
              <div className="w-full h-auto flex justify-center items-center">
                <div className="w-fit flex flex-col items-center justify-center text-center my-10">
                  <AiOutlineFileSearch className="text-8xl mb-3 text-black/40" />
                  <p className="text-lg font-semibold text-primary/60">
                    Product not found
                  </p>
                </div>
              </div>
            )}
          </div>
          {products.length > 0 && (
            <CustomPagination data={data} handleChangePage={handleChangePage} />
          )}
        </div>
      </div>
      <div className="sticky text-sm left-0 bottom-4 z-30 mb-4 bg-primary text-white sm:hidden flex item-center h-[40px]">
        <select
          value={filter}
          onChange={handleFilter}
          className="flex-1 border-r uppercase font-semibold border-gray-200 h-full focus:outline-none rounded-none px-2 py-1.5 min-w-[140px] bg-inherit"
        >
          <option value="">Select</option>
          <option value="discountPrice">Price: Lowest</option>
          <option value="-discountPrice">Price: Highest</option>
          <option value="-createdAt">Newest Arrivals</option>
        </select>
        <button
          onClick={() => dispatch(toggleFilter())}
          className="flex-1 h-full uppercase font-semibold"
        >
          Filter
        </button>
      </div>
    </div>
  );
}

export default Products;
