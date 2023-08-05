import OrderTable from "@/components/dashboard/tables/OrderTable";
import { getAllOrdersOfShop } from "@/services/seller";
import { currencyConverter } from "@/utils/helperFunc";
import { cookies } from "next/headers";
import React from "react";

export default async function page() {
  const shopId = cookies().get("seller_id")?.value as string;

  const orders = await getAllOrdersOfShop(shopId);

  const rows: any = [];
  orders &&
    orders.forEach((item: any) => {
      rows.push({
        id: item._id,
        itemsQty: item.cart.reduce(
          (acc: number, item: any) => acc + item.qty,
          0
        ),
        total: currencyConverter(item.totalPrice),
        status: item.status,
      });
    });
  return (
    <div>
      <h2 className="text-2xl font-medium">Orders</h2>
      <div className="mt-4 bg-white rounded-md shadow-sm w-full h-full">
        <OrderTable rows={rows} />
      </div>
    </div>
  );
}
