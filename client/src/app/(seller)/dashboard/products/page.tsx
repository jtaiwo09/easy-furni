import Products from "@/components/dashboard/Products";
import React from "react";
import { cookies } from "next/headers";
import { getShopProducts } from "@/services/product";

export default async function page() {
  const id = cookies().get("seller_id")?.value;
  const data = await getShopProducts(id);

  return (
    <div>
      <Products data={data} id={id} />
    </div>
  );
}
