"use client";
import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import { AiOutlineArrowRight } from "react-icons/ai";
import { DataGrid } from "@mui/x-data-grid";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getAllUsersOrders } from "@/redux/slices/orderSlice";
import { currencyConverter } from "@/utils/helperFunc";

function Refund() {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (user) {
      dispatch(getAllUsersOrders(user._id));
    }
  }, [user]);

  const sortedOrder = useMemo(
    () => orders.filter((order) => order.status === "Processing refund"),
    [orders]
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
            <Link href={`/user-order/${params.id}`}>
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

  sortedOrder &&
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

export default Refund;
