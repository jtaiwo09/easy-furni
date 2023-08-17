import ProductTable from "@/components/admin/tables/ProductTable";
import React from "react";

function page() {
  return (
    <div>
      <h2 className="text-2xl font-medium">Products</h2>
      <ProductTable />
    </div>
  );
}

export default page;
