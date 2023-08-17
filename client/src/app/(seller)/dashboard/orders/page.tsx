import OrderTable from "@/components/dashboard/tables/OrderTable";
import { getAllOrdersOfShop } from "@/services/seller";
import { cookies } from "next/headers";
import React from "react";

export default async function page() {
  const shopId = cookies().get("seller_id")?.value as string;

  const res = await getAllOrdersOfShop(shopId);

  return (
    <div>
      <h2 className="text-2xl font-medium">Orders</h2>
      <OrderTable data={res} shopId={shopId} />
    </div>
  );
}
