"use client";
import Loader from "@/components/Layout/Loader";
import OrderTable from "@/components/admin/tables/OrderTable";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Fetcher } from "@/services/swr";
import { currencyConverter } from "@/utils/helperFunc";
import React from "react";
import { BsBagDash, BsCashCoin } from "react-icons/bs";
import { TfiShoppingCartFull } from "react-icons/tfi";
import { toast } from "react-toastify";

export default async function page() {
  const resSellers = Fetcher({ url: "shop/admin-all-sellers" });
  const resOrders = Fetcher({ url: "order/admin-all-orders" });

  if (resSellers.isLoading || resOrders.isLoading) return <Loader />;

  if (resSellers.error) {
    toast.error(resSellers.error.message);
  }
  if (resOrders.error) {
    toast.error(resOrders.error.message);
  }

  const sellers = resSellers.data.sellers;
  const adminOrders: Order[] = resOrders.data.orders;
  const totalRecordOrders = resOrders.data.totalRecord;

  const adminEarning = adminOrders.reduce(
    (acc, item) => acc + item.totalPrice * 0.1,
    0
  );

  const adminBalance = adminEarning?.toFixed(2);

  return (
    <div className="">
      <h2 className="text-2xl font-medium">Overview</h2>
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
        <DashboardCard
          icon={{ label: BsCashCoin }}
          text="Total Earning"
          value={currencyConverter(adminBalance)}
          link="/admin-dashboard/payment"
          linkText="Payment Request"
        />
        <DashboardCard
          icon={{ label: BsBagDash }}
          text="All Sellers"
          value={sellers?.length ?? 0}
          link="/admin-dashboard/sellers"
          linkText="View Sellers"
        />
        <DashboardCard
          icon={{ label: TfiShoppingCartFull }}
          text="All Orders"
          value={totalRecordOrders}
          link="/admin-dashboard/orders"
          linkText="View Orders"
        />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-medium">Latest Orders</h2>
        <OrderTable />
      </div>
    </div>
  );
}
