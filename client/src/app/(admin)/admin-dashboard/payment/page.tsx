import PaymentTable from "@/components/admin/tables/PaymentTable";
import React from "react";

function page() {
  return (
    <div>
      <h2 className="text-2xl font-medium">Payment Request</h2>
      <PaymentTable />
    </div>
  );
}

export default page;
