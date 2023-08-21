"use client";
import CustomModal from "@/components/CustomModal";
import CustomPagination from "@/components/Layout/CustomPagination";
import Loader from "@/components/Layout/Loader";
import CustomButton from "@/components/form/CustomButton";
import TextField from "@/components/form/TextField";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { Fetcher } from "@/services/swr";
import {
  deleteSellerAdminApi,
  updateSellerInformationAdminApi,
} from "@/services/swr/seller/fetcher";
import { formatDate } from "@/utils/helperFunc";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormControlLabel, Switch } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Shop name is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
  description: yup.string().required("Description is required"),
  blocked: yup.boolean(),
});

function SellerTable() {
  const [shopId, setShopId] = useState("");
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? 1;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      phoneNumber: "",
      address: "",
      description: "",
      blocked: false,
    },
    resolver: yupResolver(schema),
  });

  const { data, isLoading, error, mutate } = Fetcher({
    url: "shop/admin-all-sellers",
    page: Number(page),
  });

  if (isLoading) return <Loader />;

  if (error) {
    toast.error(error.message);
  }

  const sellers: Shop[] = data.sellers;
  const totalPages = data.totalPages;
  const totalRecord = data.totalRecord;

  const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },

    {
      field: "name",
      headerName: "name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "address",
      headerName: "Seller Address",
      type: "text",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "blocked",
      headerName: "Blocked",
      type: "boolean",
      minWidth: 100,
      flex: 0.7,
    },
    {
      field: "joinedAt",
      headerName: "Date Joined",
      type: "text",
      minWidth: 120,
      flex: 0.7,
    },
    {
      field: " ",
      flex: 0.5,
      minWidth: 80,
      headerName: "Actions",
      sortable: false,
      type: "actions",
      getActions: (params: any) => [
        <GridActionsCellItem
          label="View"
          onClick={() => router.push(`/shop/priview/${params.id}`)}
          showInMenu
        />,
        <GridActionsCellItem
          label="Edit"
          onClick={() => handleEdit(params.id)}
          showInMenu
        />,
        <GridActionsCellItem
          label="Delete"
          onClick={() => setOpen(true)}
          showInMenu
        />,
      ],
    },
  ];
  const rows: any = [];

  sellers &&
    sellers.forEach((item) => {
      rows.push({
        id: item._id,
        name: item?.name,
        email: item?.email,
        joinedAt: formatDate(item.createdAt),
        address: item.address,
        blocked: item.blocked,
      });
    });

  const handleEdit = (id: string) => {
    setOpenEdit(true);
    setShopId(id);
    const seller = sellers.find((el) => el._id === id);
    console.log(seller);
    if (seller) {
      setValue("name", seller.name);
      setValue("phoneNumber", seller.phoneNumber);
      setValue("address", seller.address);
      setValue("description", seller.description);
      setValue("blocked", seller.blocked);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res = await updateSellerInformationAdminApi(data, shopId);
      setLoading(false);
      mutate();
      setOpenEdit(false);
      toast.success("Shop updated successufully");
    } catch (error: any) {
      setLoading(false);
      toast.error(error);
    }
  };

  const handleChangePage = async (e: any, page: any) => {
    router.push(`/admin-dashboard/sellers?page=${page}`);
    mutate();
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await deleteSellerAdminApi(shopId);
      setLoading(false);
      if (res.success) {
        mutate();
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error);
    }
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
      />
      <ConfirmationModal
        title="Do you want to delete this seller?"
        okText="Delete"
        okBtn={handleDelete}
        cancelBtn={() => setOpen(false)}
        open={open}
        boxStyle="!max-w-[450px]"
        okBtnClass="bg-red-500 text-white hover:text-red-500 hover:bg-red-500 border !border-[red]"
        loading={loading}
      >
        <div className="my-5">This seller will be permanently deleted</div>
      </ConfirmationModal>
      <CustomModal open={openEdit} handleClose={() => setOpenEdit(false)}>
        <div className="">
          <h2 className="text-2xl font-medium mb-4">Edit Shop</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              name="name"
              errors={errors}
              formGroup="mb-4 w-full"
              label="Shop Name"
              register={register}
            />
            <TextField
              name="phoneNumber"
              label="Phone Number"
              inputClass="leading-[24px]"
              formGroup=" mb-4 w-full"
              register={register}
              errors={errors}
            />
            <TextField
              name="address"
              label="Address"
              inputClass="leading-[24px]"
              formGroup=" mb-4 w-full"
              register={register}
              errors={errors}
            />
            <TextField
              name="description"
              label="Shop Description"
              inputClass="leading-[24px]"
              formGroup=" mb-4 w-full"
              register={register}
              errors={errors}
            />
            <FormControlLabel
              control={
                <Controller
                  name="blocked"
                  control={control}
                  render={({ field }) => {
                    const { value, ...rest } = field;
                    return (
                      <Switch
                        checked={value}
                        {...rest}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    );
                  }}
                />
              }
              label="Block Seller"
            />
            <CustomButton
              text="Update"
              type="submit"
              extraClass="mt-5"
              loading={loading}
            />
          </form>
        </div>
      </CustomModal>
    </>
  );
}

export default SellerTable;
