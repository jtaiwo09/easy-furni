"use client";
import Badge from "@/components/Badge";
import CustomModal from "@/components/CustomModal";
import CustomPagination from "@/components/Layout/CustomPagination";
import Loader from "@/components/Layout/Loader";
import CustomButton from "@/components/form/CustomButton";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { Fetcher } from "@/services/swr";
import {
  deleteWithdrawalRequestAdminApi,
  updateWithdrawalRequestAdminApi,
} from "@/services/swr/withdrawal/fetcher";
import { currencyConverter } from "@/utils/helperFunc";
import { LinearProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import { toast } from "react-toastify";

function PaymentTable() {
  const [open, setOpen] = useState(false);
  const [updateRequestModal, setUpdateRequestModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState("Processing");
  const [withdrawData, setWithdrawData] = useState<any>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? 1;

  const { data, isLoading, error, mutate } = Fetcher({
    url: "withdraw/get-all-withdraw-request",
    page: Number(page),
  });

  if (isLoading) return <Loader />;

  if (error) {
    toast.error(error.message);
  }

  const withdraws = data.withdraws;
  const totalPages = data.totalPages;
  const totalRecord = data.totalRecord;

  const columns = [
    { field: "id", headerName: "Withdraw ID", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Shop Name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "shopId",
      headerName: "Shop ID",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "status",
      headerName: "status",
      type: "text",
      minWidth: 150,
      flex: 0.8,
      renderCell: ({ value }: any) => <Badge status={value} />,
    },
    {
      field: "createdAt",
      headerName: "Request given at",
      type: "string",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: " ",
      headerName: "Update Status",
      type: "number",
      minWidth: 130,
      flex: 1,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center space-x-5">
            <BsPencil
              size={20}
              className={`${
                params.row.status !== "Processing" ? "hidden" : ""
              } cursor-pointer text-text-hover`}
              onClick={() => {
                setWithdrawData(params.row), setUpdateRequestModal(true);
              }}
            />
            <BsTrash
              size={20}
              className={` mr-5 cursor-pointer text-text-hover`}
              onClick={() => {
                setWithdrawData(params.row), setOpen(true);
              }}
            />
          </div>
        );
      },
    },
  ];

  const rows: any = [];

  withdraws.forEach((item: any) => {
    rows.push({
      id: item._id,
      shopId: item.seller._id,
      name: item.seller.name,
      amount: currencyConverter(item.amount),
      status: item.status,
      createdAt: item.createdAt.slice(0, 10),
    });
  });

  const handleChangePage = async (e: any, page: any) => {
    router.push(`/admin-dashboard/payment?page=${page}`);
    mutate();
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await deleteWithdrawalRequestAdminApi({
        id: withdrawData.id,
        sellerId: withdrawData.shopId,
      });
      setLoading(false);
      if (res.success) {
        mutate();
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await updateWithdrawalRequestAdminApi({
        id: withdrawData.id,
        sellerId: withdrawData.shopId,
      });
      setLoading(false);
      if (res.success) {
        mutate();
        toggleUpdate();
      }
    } catch (error: any) {
      setLoading(false);
      toast.error(error);
    }
  };

  const toggleUpdate = () => {
    setUpdateRequestModal((prev) => !prev);
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
        title="Do you want to delete this request?"
        okText="Delete"
        okBtn={handleDelete}
        cancelBtn={() => setOpen(false)}
        open={open}
        boxStyle="!max-w-[450px]"
        okBtnClass="bg-red-500 text-white hover:text-red-500 hover:bg-red-500 border !border-[red]"
        loading={loading}
      >
        <div className="my-5">
          This withdrawal request will be permanently deleted
        </div>
      </ConfirmationModal>
      <CustomModal open={updateRequestModal} handleClose={toggleUpdate}>
        <div className="">
          <h1 className="text-lg font-medium">Update Payment Request Status</h1>
          <br />
          <select
            name=""
            id=""
            onChange={(e) => setWithdrawStatus(e.target.value)}
            className="max-w-[400px] h-[46px] w-full border rounded-none focus:outline-none"
          >
            <option value={withdrawStatus}>{withdrawData?.status}</option>
            <option value="Success">Success</option>
          </select>
          <CustomButton
            text="Update Request"
            handleClick={handleUpdate}
            loading={loading}
            disabled={loading}
            extraClass="mt-5"
          ></CustomButton>
        </div>
      </CustomModal>
    </>
  );
}

export default PaymentTable;
