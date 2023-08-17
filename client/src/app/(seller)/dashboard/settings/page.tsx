"use client";
import Avatar from "@mui/material/Avatar";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AiOutlineCamera } from "react-icons/ai";
import { toast } from "react-toastify";
import { BiLoader } from "react-icons/bi";
import Loader from "@/components/Layout/Loader";
import TextField from "@/components/form/TextField";
import CustomButton from "@/components/form/CustomButton";
import { getSeller } from "@/services/swr/seller";
import {
  sellerMutationOptions,
  updateMutation as updateUserInformation,
} from "@/services/swr/helpers/sellerMutations";
import { updateSellerAvatarApi } from "@/services/swr/seller/fetcher";
import { useAppDispatch } from "@/redux/hook";

export type SellerFormData = {
  name: string;
  description: string;
  phoneNumber: string;
  address: string;
};

const schema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  description: yup.string().required("Description is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number")
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
});

function page() {
  const dispatch = useAppDispatch();
  const [uploadLoader, setUploadLoader] = useState(false);

  let seller: any = null;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SellerFormData>({
    defaultValues: {
      name: "",
      description: "",
      phoneNumber: "",
      address: "",
    },
    values: {
      name: seller?.name ?? "",
      description: seller?.description ?? "",
      phoneNumber: seller?.phoneNumber ?? "",
      address: seller?.address ?? "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (seller) {
      setValue("name", seller.name);
      setValue("description", seller.description);
      setValue("phoneNumber", seller.phoneNumber);
      setValue("address", seller.address);
    }
  }, [seller]);

  const { data, isLoading, mutate } = getSeller(dispatch);

  seller = data;

  if (isLoading) return <Loader />;

  if (!data) return;

  const onSubmit = async (data: SellerFormData) => {
    try {
      await mutate(
        updateUserInformation(data, seller),
        sellerMutationOptions(data, seller)
      );
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleImage = async (e: any) => {
    setUploadLoader(true);
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      try {
        await updateSellerAvatarApi(e.target.result);
        setUploadLoader(false);
        mutate();
        toast.success("Profile updated successfully!");
      } catch (error: any) {
        setUploadLoader(false);
        toast.error(error.message);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="w-full relative mt-[5%]">
      <div className="w-full">
        <div className="relative w-[120px] h-[120px] mx-auto rounded-full border-[3px] border-solid border-[#39D132]">
          <Avatar
            alt="Profile Image"
            src={seller?.avatar?.url ?? ""}
            className="!w-full !h-full rounded-full !object-contain"
          />
          <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleImage}
            />
            <label htmlFor="image">
              <AiOutlineCamera className="cursor-pointer" />
            </label>
          </div>
          {uploadLoader && (
            <div className="absolute top-0 bottom w-full h-full rounded-full bg-black/40 flex justify-center items-center">
              <BiLoader size={30} className=" text-white animate-spin " />
            </div>
          )}
        </div>
      </div>
      <div className="mt-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <TextField
              name="name"
              label="Shop Name"
              inputClass="leading-[24px]"
              formGroup=" mb-3 sm:mb-0 w-full"
              register={register}
              errors={errors}
            />
            <TextField
              name="phoneNumber"
              label="Phone Number"
              inputClass="leading-[24px]"
              formGroup=" mb-3 sm:mb-0 w-full"
              register={register}
              errors={errors}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <TextField
              name="address"
              label="Address"
              inputClass="leading-[24px]"
              formGroup=" mb-3 sm:mb-0 w-full"
              register={register}
              errors={errors}
            />
            <TextField
              name="description"
              label="Shop Description"
              inputClass="leading-[24px]"
              formGroup=" mb-3 sm:mb-0 w-full"
              register={register}
              errors={errors}
            />
          </div>
          <CustomButton
            type="submit"
            text="Update"
            extraClass="mt-8 w-full sm:w-fit"
          />
        </form>
      </div>
    </div>
  );
}

export default page;
