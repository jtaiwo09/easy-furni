"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import Avatar from "@mui/material/Avatar";
import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AiOutlineCamera } from "react-icons/ai";
import { baseUrl } from "@/server";
import { toast } from "react-toastify";
import { getUser, updateUserInformation } from "@/redux/slices/userSlice";
import { BiLoader } from "react-icons/bi";
import Loader from "@/components/Layout/Loader";
import TextField from "@/components/form/TextField";
import CustomButton from "@/components/form/CustomButton";

const schema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Must be a valid email address")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Must be number")
    .required("Phone number is required"),
  password: yup.string().required("Password is required"),
});

export type ProfileFormData = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
};

function page() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const res = await dispatch(updateUserInformation(data)).unwrap();
      if (res.success) {
        toast.success("Profile updated successfully!");
        reset();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleImage = async (e: any) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const res = await fetch(`${baseUrl}/user/update-avatar`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: e.target.result }),
      });
      const result = await res.json();

      if (res.ok) {
        dispatch(getUser());
        toast.success("Profile photo has been updated");
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast.error(result.message);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  if (!user) return <Loader />;

  return (
    <div className="w-full relative">
      <div className="w-full">
        <div className="relative w-[120px] h-[120px] mx-auto rounded-full border-[3px] border-solid border-[#39D132]">
          <Avatar
            alt="Remy Sharp"
            src={user?.avatar.url ?? ""}
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
          {isLoading && (
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
              label="Full Name"
              inputClass="leading-[24px]"
              formGroup=" mb-4 sm:mb-0 w-full"
              register={register}
              errors={errors}
            />
            <TextField
              name="email"
              label="Email Address"
              inputClass="leading-[24px]"
              formGroup=" mb-4 sm:mb-0 w-full"
              register={register}
              errors={errors}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <TextField
              name="phoneNumber"
              label="Phone Number"
              inputClass="leading-[24px]"
              formGroup=" mb-4 sm:mb-0 w-full"
              register={register}
              errors={errors}
            />
            <TextField
              name="password"
              type="password"
              label="Enter password"
              inputClass="leading-[24px]"
              formGroup=" mb-4 sm:mb-0 w-full"
              register={register}
              errors={errors}
            />
          </div>
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
