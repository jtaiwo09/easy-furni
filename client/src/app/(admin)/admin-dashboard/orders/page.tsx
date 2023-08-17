import OrderTable from "@/components/admin/tables/OrderTable";
import React from "react";

function page() {
  return (
    <div>
      <h2 className="text-2xl font-medium">Orders</h2>
      <OrderTable />
    </div>
  );
}

export default page;
