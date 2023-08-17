"use client";
import React from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import { AiOutlineArrowRight } from "react-icons/ai";
import { DataGrid } from "@mui/x-data-grid";
import { useAppSelector } from "@/redux/hook";
import { currencyConverter } from "@/utils/helperFunc";
import Loader from "@/components/Layout/Loader";
import { getAllOrdersOfShop, getAllUsersOrders } from "@/services/swr/order";
import { toast } from "react-toastify";

function page() {
  const { seller } = useAppSelector((state) => state.seller);

  const { data, error, isLoading } = getAllOrdersOfShop(seller?._id);

  const orders: Order[] = data?.orders ?? [];

  if (isLoading) return <Loader />;
  if (error) {
    toast.error(error.message);
  }

  const sortedOrder = orders.filter(
    (order) =>
      order.status === "Processing refund" || order.status === "Refund Success"
  );

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params: any) => {
        return params === "Delivered" ? "greenColor" : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params: any) => {
        return (
          <>
            <Link href={`/order/seller/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row: any = [];

  sortedOrder.forEach((item: any) => {
    row.push({
      id: item._id,
      itemsQty: item.cart.length,
      total: currencyConverter(item.totalPrice),
      status: item.status,
    });
  });

  return (
    <div className="overflow-scroll hide-scroll bg-white">
      <DataGrid
        rows={row}
        columns={columns}
        pageSizeOptions={[10, 100]}
        disableRowSelectionOnClick
        autoHeight
      />
    </div>
  );
}

export default page;
