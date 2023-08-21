"use client";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import Button from "@mui/material/Button";
import { AiOutlineArrowRight } from "react-icons/ai";
import { currencyConverter } from "@/utils/helperFunc";
import CustomPagination from "@/components/Layout/CustomPagination";
import { usePathname, useRouter } from "next/navigation";

function OrderTable({ data }: any) {
  const orders = data.orders;
  const pathname = usePathname();
  const router = useRouter();

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

  const rows: any = [];

  orders &&
    orders.forEach((item: any) => {
      rows.push({
        id: item._id,
        itemsQty: item.cart.reduce(
          (acc: number, item: any) => acc + item.qty,
          0
        ),
        total: currencyConverter(item.totalPrice),
        status: item.status,
      });
    });

  const handleChangePage = async (e: any, page: any) => {
    router.push(`/dashboard/orders?page=${page}`);
  };

  return (
    <>
      <div className="mt-4 bg-white rounded-md shadow-sm w-full h-full">
        <DataGrid
          columns={columns}
          rows={rows}
          disableRowSelectionOnClick
          autoHeight
          hideFooter
        />
      </div>
      {pathname !== "/dashboard" && (
        <CustomPagination data={data} handleChangePage={handleChangePage} />
      )}
    </>
  );
}

export default OrderTable;
