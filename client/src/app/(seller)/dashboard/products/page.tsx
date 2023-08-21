import Products from "@/components/dashboard/Products";
import React from "react";
import { cookies } from "next/headers";

export default async function page() {
  const id = cookies().get("seller_id")?.value ?? "";

  return (
    <div>
      <Products id={id} />
    </div>
  );
}
