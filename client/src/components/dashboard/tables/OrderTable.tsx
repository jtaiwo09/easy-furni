"use client";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import { Button } from "@mui/material";
import { AiOutlineArrowRight } from "react-icons/ai";

function OrderTable({ rows }: any) {
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

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      pageSizeOptions={[10, 25, 100]}
      disableRowSelectionOnClick
      autoHeight
    />
  );
}

export default OrderTable;
