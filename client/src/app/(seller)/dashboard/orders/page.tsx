import OrderTable from "@/components/dashboard/tables/OrderTable";
import { getAllOrdersOfShop } from "@/services/seller";
import { cookies } from "next/headers";
import React from "react";

export default async function page({ searchParams }: IsearchParams) {
  const shopId = cookies().get("seller_id")?.value as string;
  const page = searchParams["page"] ?? 1;

  const res = await getAllOrdersOfShop(shopId, Number(page));

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-medium">Orders</h2>
      <OrderTable data={res} />
    </div>
  );
}
