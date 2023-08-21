import UserTable from "@/components/admin/tables/UserTable";
import React from "react";

function page() {
  return (
    <div>
      <h2 className="text-2xl font-medium">Users</h2>
      <UserTable />
    </div>
  );
}

export default page;
