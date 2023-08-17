"use client";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Link from "next/link";
import Button from "@mui/material/Button";
import { AiOutlineArrowRight, AiOutlineEye } from "react-icons/ai";
import { currencyConverter, formatDate } from "@/utils/helperFunc";
import CustomPagination from "@/components/Layout/CustomPagination";
import LinearProgress from "@mui/material/LinearProgress";
import { toast } from "react-toastify";
import Badge from "@/components/Badge";
import { Fetcher } from "@/services/swr";
import Loader from "@/components/Layout/Loader";

function ProductTable() {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, mutate } = Fetcher({
    url: "product/get-all-products",
    page,
  });

  if (isLoading) return <Loader />;

  if (error) {
    toast.error(error.message);
  }

  const products: Product[] = data.products;
  const totalPages = data.totalPages;
  const totalRecord = data.totalRecord;

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1,
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
      headerName: "",
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

  const rows: any = [];

  products.forEach((item) => {
    rows.push({
      id: item._id,
      name: item.name,
      price: currencyConverter(item.discountPrice),
      Stock: item.stock,
      sold: item?.sold_out,
    });
  });

  const handleChangePage = async (page: any) => {
    setPage(page);
    mutate();
  };

  return (
    <>
      <div className="mt-4 bg-white rounded-md shadow-sm w-full h-full">
        {isLoading && <LinearProgress />}
        <DataGrid
          columns={columns}
          rows={rows}
          disableRowSelectionOnClick
          autoHeight
          hideFooter
        />
      </div>
      <CustomPagination
        data={{ totalPages, totalRecord }}
        handleChangePage={handleChangePage}
        page={page}
      />
    </>
  );
}

export default ProductTable;
