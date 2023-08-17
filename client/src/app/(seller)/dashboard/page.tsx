import DashboardCard from "@/components/dashboard/DashboardCard";
import OrderTable from "@/components/dashboard/tables/OrderTable";
import { getShopProducts } from "@/services/product";
import { getAllOrdersOfShop } from "@/services/seller";
import { getSellerApiServer } from "@/services/serverApi/seller";
import { currencyConverter } from "@/utils/helperFunc";
import { cookies } from "next/headers";
import React from "react";
import { BsBagDash, BsBasket, BsCashCoin } from "react-icons/bs";

export default async function page() {
  const shopId = cookies().get("seller_id")?.value as string;

  const resOrders = await getAllOrdersOfShop(shopId, 1, 5);
  const productApi = await getShopProducts(shopId);
  const products = productApi.products;
  const res: any = await getSellerApiServer();
  const seller = res.seller;
  const orders = resOrders.orders;
  const availableBalance = seller?.availableBalance.toFixed(2);

  return (
    <div className="">
      <h2 className="text-2xl font-medium">Overview</h2>
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
        <DashboardCard
          icon={{ label: BsCashCoin }}
          text="Account Balance (with 10% service charge)"
          value={currencyConverter(availableBalance)}
          link="/dashboard/payment"
          linkText="Withdrawal Money"
        />
        <DashboardCard
          icon={{ label: BsBasket }}
          text="All Orders"
          value={resOrders.totalRecord}
          link="/dashboard/orders"
          linkText="View Orders"
        />
        <DashboardCard
          icon={{ label: BsBagDash }}
          text="All Products"
          value={products.length}
          link="/dashboard/products"
          linkText="View Products"
        />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-medium">Latest Orders</h2>
        <OrderTable data={resOrders} shopId={shopId} />
      </div>
    </div>
  );
}
