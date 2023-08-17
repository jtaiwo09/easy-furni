"use client";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import Button from "@mui/material/Button";
import { AiOutlineArrowRight } from "react-icons/ai";
import { currencyConverter, formatDate } from "@/utils/helperFunc";
import CustomPagination from "@/components/Layout/CustomPagination";
import LinearProgress from "@mui/material/LinearProgress";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import Badge from "@/components/Badge";
import { Fetcher } from "@/services/swr";
import Loader from "@/components/Layout/Loader";

function OrderTable() {
  const [page, setPage] = useState(1);
  const pathname = usePathname();

  const resOrders = Fetcher({ url: "order/admin-all-orders", page });

  if (resOrders.isLoading) return <Loader />;

  if (resOrders.error) {
    toast.error(resOrders.error.message);
  }

  const adminOrders: Order[] =
    pathname !== "/admin-dashboard"
      ? resOrders.data.orders.slice(0, 5)
      : resOrders.data.orders;
  const totalPages = resOrders.data.totalPages;
  const totalRecord = resOrders.data.totalRecord;

  const columns: any = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 1,
      renderCell: (params: any) => {
        return <Badge status={params.value} />;
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "string",
      minWidth: 130,
      flex: 1,
      headerAlign: "left",
    },

    {
      field: "total",
      headerName: "Total",
      type: "string",
      minWidth: 130,
      flex: 1,
      headerAlign: "left",
    },
    {
      field: "createdAt",
      headerName: "Date",
      type: "string",
      minWidth: 130,
      flex: 1,
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

  const rows: any = [];
  adminOrders.forEach((item: any) => {
    rows.push({
      id: item._id,
      itemsQty: item.cart.reduce((acc: number, item: any) => acc + item.qty, 0),
      total: currencyConverter(item.totalPrice),
      status: item.status,
      createdAt: formatDate(item.createdAt),
    });
  });

  const handleChangePage = async (e: any, page: any) => {
    setPage(page);
    resOrders.mutate();
  };

  return (
    <>
      <div className="mt-4 bg-white rounded-md shadow-sm w-full h-full">
        {resOrders.isLoading && <LinearProgress />}
        <DataGrid
          columns={columns}
          rows={rows}
          disableRowSelectionOnClick
          autoHeight
          hideFooter
        />
      </div>
      {pathname !== "/admin-dashboard" && (
        <CustomPagination
          data={{ totalPages, totalRecord }}
          handleChangePage={handleChangePage}
          page={page}
        />
      )}
    </>
  );
}

export default OrderTable;
