import Link from "next/link";
import React from "react";

function CategoriesData({ categoriesData }: any) {
  return (
    <ul className="p-4 min-w-[250px] absolute top-[100%] bg-slate-50 shadow-md hidden group-hover:block border">
      {categoriesData &&
        categoriesData.map((data: any) => (
          <li key={data.id}>
            <Link
              href={`/products?category=${data.title}`}
              className="flex items-center h-full text-sm py-1.5 hover:text-text-hover hover:font-medium whitespace-nowrap transition-all duration-300"
            >
              <img
                src={data.image_Url}
                alt=""
                className="h-[25px] w-[25px] object-contain mr-2.5 select-none"
              />
              {data.title}
            </Link>
          </li>
        ))}
    </ul>
  );
}

export default CategoriesData;
