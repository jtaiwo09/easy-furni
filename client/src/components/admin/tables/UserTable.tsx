"use client";
import CustomPagination from "@/components/Layout/CustomPagination";
import Loader from "@/components/Layout/Loader";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { Fetcher } from "@/services/swr";
import { deleteSellerAdminApi } from "@/services/swr/seller/fetcher";
import { formatDate } from "@/utils/helperFunc";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid, GridActionsCellItem, GridRowId } from "@mui/x-data-grid";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

function UserTable() {
  const [userId, setUserId] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? 1;

  const { data, isLoading, error, mutate } = Fetcher({
    url: "user/admin-all-users",
    page: Number(page),
  });

  if (isLoading) return <Loader />;

  if (error) {
    toast.error(error.message);
  }

  const users: Shop[] = data.users;
  const totalPages = data.totalPages;
  const totalRecord = data.totalRecord;

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 150, flex: 0.7 },

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
      field: "role",
      headerName: "User Role",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "joinedAt",
      headerName: "Date Joined",
      type: "string",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 0.4,
      minWidth: 100,
      headerName: "Action",
      sortable: false,
      type: "actions",
      getActions: () => [
        <GridActionsCellItem label="View" onClick={() => {}} showInMenu />,
        <GridActionsCellItem label="Edit" onClick={() => {}} showInMenu />,
        <GridActionsCellItem label="Delete" onClick={() => {}} showInMenu />,
      ],
    },
  ];

  const rows: any = [];
  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role?.toLowerCase(),
        joinedAt: formatDate(item.createdAt),
      });
    });

  const handleChangePage = async (e: any, page: any) => {
    router.push(`/admin-dashboard/users?page=${page}`);
    mutate();
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await deleteSellerAdminApi(userId);
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
    </>
  );
}

export default UserTable;
