"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { updateUserPassword } from "@/redux/slices/userSlice";
import { toast } from "react-toastify";
import TextField from "@/components/form/TextField";
import CustomButton from "@/components/form/CustomButton";

export interface ChangePasswordFormData {
  password: string;
  newPassword: string;
  confirmPassword: string | undefined;
}

const schema = yup.object().shape({
  password: yup.string().required("Password is required"),
  newPassword: yup
    .string()
    .min(6, "Must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), ""], "Passwords must match"),
});

function page() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      const res = await dispatch(updateUserPassword(data)).unwrap();
      if (res.success) {
        toast.success(res.message);
        reset();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="w-full bg-white p-5 shadow-md rounded-sm">
      <h2 className="text-primary uppercase mb-4 text-center font-semibold text-2xl">
        Change Password
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          name="password"
          type="password"
          label="Old Password"
          inputClass="leading-[24px]"
          formGroup=" mb-4 w-full"
          register={register}
          errors={errors}
        />
        <TextField
          name="newPassword"
          type="password"
          label="New Password"
          inputClass="leading-[24px]"
          formGroup=" mb-4 w-full"
          register={register}
          errors={errors}
        />
        <TextField
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          inputClass="leading-[24px]"
          formGroup=" mb-4 w-full"
          register={register}
          errors={errors}
        />
        <CustomButton
          loading={loading}
          type="submit"
          text="Update"
          extraClass="mt-5"
        />
      </form>
    </div>
  );
}

export default page;
