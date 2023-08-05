import Products from "@/components/dashboard/Products";
import React from "react";
import { cookies } from "next/headers";
import { currencyConverter } from "@/utils/helperFunc";
import { getShopProducts } from "@/services/product";

export default async function page() {
  const id = cookies().get("seller_id")?.value;
  const data = await getShopProducts(id);

  const rows = [] as any;

  data &&
    data.products.forEach((item: any) => {
      rows.push({
        id: item._id,
        name: item.name,
        price: currencyConverter(item.originalPrice),
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });
  return (
    <div>
      <Products rows={rows} />
    </div>
  );
}

// export default page;
