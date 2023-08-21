"use client";
import Avatar from "@mui/material/Avatar";
import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AiOutlineCamera } from "react-icons/ai";
import { toast } from "react-toastify";
import { BiLoader } from "react-icons/bi";
import Loader from "@/components/Layout/Loader";
import TextField from "@/components/form/TextField";
import CustomButton from "@/components/form/CustomButton";
import {
  updateSellerAvatarApi,
  updateSellerInformationApi,
} from "@/services/swr/seller/fetcher";
import { Fetcher } from "@/services/swr";
import FormHelperText from "@mui/material/FormHelperText";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { updateSeller } from "@/redux/slices/sellerSlice";

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
  const [uploadLoader, setUploadLoader] = useState(false);
  const [loading, setLoading] = useState(false);

  const { seller: sellerData } = useAppSelector((state) => state.seller);
  const dispatch = useAppDispatch();

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
      name: sellerData?.name ?? "",
      description: sellerData?.description ?? "",
      phoneNumber: sellerData?.phoneNumber ?? "",
      address: sellerData?.address ?? "",
    },
    resolver: yupResolver(schema),
  });

  const { data, isLoading, error, mutate } = Fetcher({
    url: "shop/get-seller",
  });

  if (isLoading) return <Loader />;

  if (error) {
    toast.error(error.message);
  }

  const seller: Shop = data?.seller;

  const onSubmit = async (data: SellerFormData) => {
    try {
      setLoading(true);
      const result = await updateSellerInformationApi(data);
      dispatch(updateSeller(result));
      await mutate();
      setLoading(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      setLoading(false);
      toast.error(error);
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
    <div className="w-full relative bg-white h-full">
      <div className="max-w-[600px] mx-auto w-full p-5">
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
        <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
          {/* <div className="flex flex-col sm:flex-row gap-4 mb-4"> */}
          <TextField
            name="name"
            label="Shop Name"
            inputClass="leading-[24px]"
            formGroup=" mb-5 w-full"
            register={register}
            errors={errors}
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            inputClass="leading-[24px]"
            formGroup=" mb-5 w-full"
            register={register}
            errors={errors}
          />
          {/* </div>
          <div className="flex flex-col sm:flex-row gap-4"> */}
          <TextField
            name="address"
            label="Address"
            inputClass="leading-[24px]"
            formGroup=" mb-5 w-full"
            register={register}
            errors={errors}
          />
          <div className="">
            <label
              htmlFor="shop-description"
              className="leading-[18px] text-sm font-medium block tracking-[0.5px] mb-1"
            >
              Shop Description
            </label>
            <textarea
              id="shop-description"
              {...register("description")}
              className="w-full min-h-[100px] text-base border border-form-border shadow-none rounded-none bg-white focus:outline-none px-4 py-2"
            ></textarea>
            <FormHelperText className="!text-red-500">
              {errors.description?.message}
            </FormHelperText>
          </div>
          {/* </div> */}
          <CustomButton
            type="submit"
            text="Update"
            loading={loading}
            extraClass="mt-8 w-full sm:w-fit"
          />
        </form>
      </div>
    </div>
  );
}

export default page;
