"use client";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

function CouponTable({ rows }: any) {
  const handleDelete = (id: string) => {
    //
  };

  const columns = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Coupon Code",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Value",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Delete",
      type: "number",
      sortable: false,
      renderCell: (params: any) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
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

export default CouponTable;
