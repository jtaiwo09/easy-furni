"use client";
import CustomModal from "@/components/CustomModal";
import Loader from "@/components/Layout/Loader";
import DashboardCard from "@/components/dashboard/DashboardCard";
import WidthdrawalTable from "@/components/dashboard/tables/WidthdrawalTable";
import CurrencyTextField from "@/components/form/CurrencyTextField";
import CustomButton from "@/components/form/CustomButton";
import TextField from "@/components/form/TextField";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { useAppDispatch } from "@/redux/hook";
import { getBanks } from "@/services";
import {
  createBankMutation,
  deleteBankMutation,
  sellerMutationOptions,
} from "@/services/swr/helpers/sellerMutations";
import { createWithdrawalRequestApi } from "@/services/swr/seller/fetcher";
import { currencyConverter, formatDate } from "@/utils/helperFunc";
import { yupResolver } from "@hookform/resolvers/yup";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiTrashAlt } from "react-icons/bi";
import { BsCashCoin } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import * as yup from "yup";
import BankHolderName from "@/components/form/bank/BankHolderName";
import BankNames from "@/components/form/bank/BankNames";
import { Fetcher } from "@/services/swr";
import { useSearchParams } from "next/navigation";

export type AddPaymentMethod = {
  bankName: any;
  bankAccountNumber: string;
  bankHolderName: string;
};

const schema = yup.object().shape({
  bankName: yup.mixed().required("Bank name is required"),
  bankHolderName: yup.string().required("Full name is required"),
  bankAccountNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number")
    .required("Account number is required"),
});

const amountSchema = yup.object().shape({
  amount: yup
    .number()
    .typeError("Must be a number")
    .test(
      "notLessThanZero",
      "Minimum withdrawal is ₦ 5,000",
      (value: any) => value >= 5000
    )
    .required("Amount is required"),
});

function page() {
  const [open, setOpen] = useState(false);
  const [addPayment, setAddPayment] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [banks, setBanks] = useState<IBank[]>([]);
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? 1;

  useEffect(() => {
    const getBankNames = async () => {
      try {
        const res = await getBanks();
        setBanks(
          res?.map((el: any) => ({
            id: el.id,
            name: el.name,
            code: el.code,
          }))
        );
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    getBankNames();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control: withdrawalControl,
    formState: { errors },
  } = useForm<AddPaymentMethod>({
    defaultValues: {
      bankName: "",
      bankHolderName: "",
      bankAccountNumber: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit: withdrawalSubmit,
    formState: { errors: amountError },
    reset: resetWithdrawal,
  } = useForm({
    defaultValues: {
      amount: 0,
    },
    resolver: yupResolver(amountSchema),
  });

  const resSeller = Fetcher({ url: "shop/get-seller" });

  const resWithdrawal = Fetcher({
    url: "withdraw/get-seller-withdrawals",
    page: Number(page),
  });

  if (resSeller.isLoading || resWithdrawal.isLoading) return <Loader />;

  console.log(resWithdrawal.error);

  if (resSeller.error) {
    toast.error(resSeller.error.message);
  }
  if (resWithdrawal.error) {
    toast.error(resWithdrawal.error.message);
  }

  const seller: Shop = resSeller.data?.seller;

  const widthdrawals = resWithdrawal.data?.withdrawals;

  const availableBalance = seller?.availableBalance;

  const withdrawMethod = seller?.withdrawMethod;

  const toggleModal = () => {
    setOpen((prev) => !prev);
  };

  const toggleAddPayment = () => {
    if (open) {
      setOpen(false);
    }
    reset();
    setAddPayment((prev) => !prev);
  };

  const onSubmit = (data: any) => {
    try {
      resWithdrawal.mutate(
        createBankMutation(data, seller),
        sellerMutationOptions(data, seller)
      );
      toggleAddPayment();
      toast.success("Bank Details Added Successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const editBankDetails = () => {
    console.log(withdrawMethod);
    toggleAddPayment();
    setValue("bankName", withdrawMethod.bankName);
    setValue("bankHolderName", withdrawMethod.bankHolderName);
    setValue("bankAccountNumber", withdrawMethod.bankAccountNumber);
  };

  const handleDelete = () => {
    const data = { ...seller, withdrawMethod: null };
    try {
      resWithdrawal.mutate(
        deleteBankMutation(seller),
        sellerMutationOptions(data, seller)
      );
      setDeleteModal(false);
      toast.success("Bank Details Deleted Successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleWithdrawal = async (data: { amount: number }) => {
    if (data.amount > Number(availableBalance)) {
      toast.error("You cannot withdraw this amount!");
    } else {
      setDeleteLoader(true);
      try {
        await createWithdrawalRequestApi(data);
        await resWithdrawal.mutate();
        setDeleteLoader(false);
        setOpen(false);
        resetWithdrawal();

        toast.success("Withdraw request is successful!");
      } catch (error: any) {
        setDeleteLoader(false);
        toast.error(error.message);
      }
    }
  };

  const rows: any = [];

  widthdrawals &&
    widthdrawals.forEach((item: any) => {
      rows.push({
        id: item._id,
        amount: currencyConverter(item.amount),
        status: item.status,
        date: formatDate(item.createdAt),
      });
    });

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
        <DashboardCard
          icon={{ label: BsCashCoin }}
          text="Account Balance (with 10% service charge)"
          value={currencyConverter(availableBalance)}
          link="/dashboard/payment"
          linkText=""
        />
        {withdrawMethod ? (
          <div className="rounded-md shadow-sm border overflow-hidden">
            <div className="bg-primary text-white p-5">
              <p className=" flex items-center space-x-3 mb-0.5">
                <span className="font-medium">Name:</span>
                <span className="font-medium text-sm tracking-widest">
                  {withdrawMethod.bankHolderName}
                </span>
              </p>
              <p className=" flex items-center space-x-3 mb-0.5">
                <span className="font-medium">Account Number:</span>
                <span className="font-medium text-sm tracking-widest">
                  {"*".repeat(withdrawMethod.bankAccountNumber.length - 3) +
                    withdrawMethod.bankAccountNumber.slice(-3)}
                </span>
              </p>
              <p className=" flex items-center space-x-3 mb-0.5">
                <span className="font-medium">Bank Name:</span>
                <span className="font-medium text-sm tracking-widest">
                  {banks.find((el) => el.code == withdrawMethod.bankName)?.name}
                </span>
              </p>
            </div>
            <div className="flex px-3 py-2 bg-white justify-end">
              <div className="w-fit flex gap-2 items-center">
                <Tooltip title="Edit">
                  <IconButton onClick={editBankDetails}>
                    <MdEdit className="text-lg text-primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    className="mr-2"
                    onClick={() => {
                      setDeleteModal(true);
                    }}
                  >
                    <BiTrashAlt className="text-lg text-red-500" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="mt-8 bg-[#f4f4f4]">
        <div className="flex justify-between items-center flex-wrap gap-y-2">
          <h2 className="text-xl sm:text-2xl font-medium">Withdrawal</h2>
          <CustomButton text="Withdraw" handleClick={toggleModal} />
        </div>
        <div className="">
          <WidthdrawalTable rows={rows} data={resWithdrawal.data} />
        </div>
      </div>
      <CustomModal open={open} handleClose={toggleModal}>
        <div className="">
          {withdrawMethod ? (
            <form onSubmit={withdrawalSubmit(handleWithdrawal)}>
              <CurrencyTextField
                name="amount"
                label="Withdraw amount"
                formGroup=" mb-4 w-full"
                placeholder="Enter amount"
                control={control}
                errors={amountError}
              />
              <div className="mt-1">
                <span className="font-semibold">Name: </span>{" "}
                {withdrawMethod.bankHolderName}
                <br />
                <span className="font-semibold">Account Number: </span>
                {withdrawMethod.bankAccountNumber}
                <br />
                <span className="font-semibold">Bank: </span>
                {banks.find((el) => el.code == withdrawMethod.bankName)?.name}
                <br />
              </div>
              <CustomButton
                text="request withdrawal"
                type="submit"
                extraClass="mt-5"
                loading={deleteLoader}
              />
            </form>
          ) : (
            <div className="flex justify-center items-center">
              <div className="w-fit py-10">
                <p className="">No Bank Details Added</p>
                <CustomButton
                  text="Add new"
                  extraClass="mx-auto mt-5"
                  handleClick={toggleAddPayment}
                />
              </div>
            </div>
          )}
        </div>
      </CustomModal>
      <CustomModal open={addPayment} handleClose={toggleAddPayment}>
        <div className="">
          <h2 className="text-2xl font-semibold mb-3">
            {withdrawMethod ? "Update" : "Add"} Bank Account
          </h2>
          <form className="" onSubmit={handleSubmit(onSubmit)}>
            <BankNames
              name="bankName"
              label="Bank Name"
              control={withdrawalControl}
              formGroup="mb-3"
              errors={errors}
              data={banks}
            />
            <TextField
              name="bankAccountNumber"
              label="Account Number"
              inputClass="leading-[24px]"
              formGroup="mb-3"
              register={register}
              errors={errors}
            />
            <BankHolderName
              name="bankHolderName"
              label="Full Name"
              inputClass="leading-[24px]"
              formGroup=""
              bankAccountNumber={watch("bankAccountNumber")}
              bankName={watch("bankName")}
              setValue={setValue}
              register={register}
              errors={errors}
              setDeleteLoader={setDeleteLoader}
            />
            <CustomButton
              type="submit"
              loading={deleteLoader}
              text={withdrawMethod ? "Update Bank" : "Add Bank"}
              extraClass="mt-5"
            />
          </form>
        </div>
      </CustomModal>
      <ConfirmationModal
        title="Delete this bank account?"
        okText="Delete"
        okBtn={handleDelete}
        cancelBtn={() => setDeleteModal(false)}
        open={deleteModal}
        boxStyle="!max-w-[450px]"
        okBtnClass="bg-red-500 text-white hover:text-red-500 hover:bg-red-500 border !border-[red]"
        loading={deleteLoader}
      >
        <div className="my-5">
          This bank account will be permanently deleted
        </div>
      </ConfirmationModal>
    </>
  );
}

export default page;
