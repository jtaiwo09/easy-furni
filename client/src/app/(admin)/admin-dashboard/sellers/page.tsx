import SellerTable from "@/components/admin/tables/SellerTable";
import React from "react";

function page() {
  return (
    <div>
      <h2 className="text-2xl font-medium">Sellers</h2>
      <SellerTable />
    </div>
  );
}

export default page;
