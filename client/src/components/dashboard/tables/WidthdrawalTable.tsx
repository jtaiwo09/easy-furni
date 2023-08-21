import CustomPagination from "@/components/Layout/CustomPagination";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import React from "react";

function WidthdrawalTable({ rows, data }: any) {
  const router = useRouter();
  const columns = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 180,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 100,
      flex: 1,
    },
  ];

  const handleChangePage = async (e: any, page: any) => {
    router.push(`/dashboard/payment?page=${page}`);
  };

  return (
    <>
      <div className="mt-4 bg-white rounded-md shadow-sm w-full h-full">
        <DataGrid
          columns={columns}
          rows={rows}
          pageSizeOptions={[10, 25, 100]}
          disableRowSelectionOnClick
          autoHeight
          hideFooter
        />
      </div>

      <CustomPagination data={data} handleChangePage={handleChangePage} />
    </>
  );
}

export default WidthdrawalTable;
