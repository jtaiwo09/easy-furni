"use client";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import Button from "@mui/material/Button";
import { AiOutlineArrowRight } from "react-icons/ai";
import { currencyConverter } from "@/utils/helperFunc";
import CustomPagination from "@/components/Layout/CustomPagination";
import { getAllOrdersOfShop } from "@/services/seller";
import LinearProgress from "@mui/material/LinearProgress";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";

function OrderTable({ data, shopId }: any) {
  const orders = data.orders;
  const [value, setValue] = useState(orders);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pathname = usePathname();

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
  value.length > 0 &&
    value.forEach((item: any) => {
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
    setPage(page);
    setLoading(true);
    try {
      const res = await getAllOrdersOfShop(shopId, page);
      setValue(res.orders);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="mt-4 bg-white rounded-md shadow-sm w-full h-full">
        {loading && <LinearProgress />}
        <DataGrid
          columns={columns}
          rows={rows}
          disableRowSelectionOnClick
          autoHeight
          hideFooter
        />
      </div>
      {pathname !== "/dashboard" && (
        <CustomPagination
          data={data}
          handleChangePage={handleChangePage}
          page={page}
        />
      )}
    </>
  );
}

export default OrderTable;
