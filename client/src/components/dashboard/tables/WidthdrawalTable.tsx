import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

function WidthdrawalTable({ rows }: any) {
  const handleDelete = (id: string) => {
    //
  };
  const columns = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 0.7 },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 100,
      flex: 0.6,
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

export default WidthdrawalTable;
