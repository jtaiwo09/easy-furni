"use client";
import CustomPagination from "@/components/Layout/CustomPagination";
import { currencyConverter } from "@/utils/helperFunc";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import React from "react";
import { useRouter } from "next/navigation";

interface IProps {
  data: any;
  edit: any;
  handlePagination: any;
  deleteProduct: any;
}

function ProductTable({ data, edit, handlePagination, deleteProduct }: IProps) {
  const products: Product[] = data?.products ?? [];
  const router = useRouter();

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
      headerName: "Action",
      sortable: false,
      type: "actions",
      getActions: (params: any) => [
        <GridActionsCellItem
          label="View"
          onClick={() => router.push(`/product/${params.id}`)}
          showInMenu
        />,
        <GridActionsCellItem
          label="Update"
          onClick={() => handleEdit(params.id)}
          showInMenu
        />,
        <GridActionsCellItem
          label="Delete"
          onClick={() => handleDelete(params.id)}
          showInMenu
        />,
      ],
    },
  ];

  const rows: any = [];

  products &&
    products.forEach((item: any) => {
      rows.push({
        id: item._id,
        name: item.name,
        price: currencyConverter(item.discountPrice),
        Stock: item.stock,
        sold: item?.sold_out,
      });
    });

  const handleEdit = (id: string) => {
    edit(id);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
  };

  const handleChangePage = async (e: any, page: any) => {
    handlePagination(page);
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

export default ProductTable;
