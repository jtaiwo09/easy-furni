"use client";
import CustomPagination from "@/components/Layout/CustomPagination";
import { getShopProducts } from "@/services/product";
import { currencyConverter } from "@/utils/helperFunc";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { toast } from "react-toastify";

function ProductTable({ data, id }: any) {
  const products = data.products;
  const [value, setValue] = useState(products);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },

    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Preview",
      type: "number",
      sortable: false,
      renderCell: (params: any) => {
        return (
          <>
            <Link href={`/product/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const rows = [] as any;

  value &&
    value.forEach((item: any) => {
      rows.push({
        id: item._id,
        name: item.name,
        price: currencyConverter(item.originalPrice),
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  const handleChangePage = async (e: any, page: any) => {
    setPage(page);
    setLoading(true);
    try {
      const res = await getShopProducts(id, page);
      setValue(res.products);
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
          pageSizeOptions={[10, 25, 100]}
          disableRowSelectionOnClick
          autoHeight
        />
      </div>
      <CustomPagination
        data={data}
        handleChangePage={handleChangePage}
        page={page}
      />
    </>
  );
}

export default ProductTable;
