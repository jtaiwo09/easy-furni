"use client";
import CustomModal from "@/components/CustomModal";
import CustomButton from "@/components/form/CustomButton";
import CustomForm from "@/components/form/CustomForm";
import TextField from "@/components/form/TextField";
import { shopResetPasswordApi } from "@/services/seller";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { LuCheckCircle } from "react-icons/lu";
import { RiErrorWarningLine } from "react-icons/ri";
import * as yup from "yup";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be atleast 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Password is required")
    .oneOf([yup.ref("password"), ""], "Passwords must match"),
});

function page() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  const onSubmit = async (data: any, reset: any) => {
    const newData = {
      token,
      userId: id,
      password: data.password,
    };
    try {
      setLoading(true);
      const res = await shopResetPasswordApi(newData);
      setLoading(false);
      if (res.success) {
        setOpen(true);
        setSuccess(true);
        reset();
      }
    } catch (error: any) {
      setMessage(error.message);
      setLoading(false);
      setOpen(true);
      setSuccess(false);
    }
  };
  return (
    <div className="flex justify-center min-h-[calc(100vh-70px)]">
      <div className="px-4 w-[500px] mt-[30%] sm:mt-[10%]">
        <h2 className="text-lg sm:text-[24px] leading-[24px] tracking-[0.5] text-[rgba(32,32,32,1)] font-bold mb-5 uppercase">
          Reset Password
        </h2>
        <CustomForm
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={{ password: "", confirmPassword: "" }}
        >
          <TextField
            name="password"
            label="Password"
            type="password"
            inputClass="leading-[24px]"
            formGroup="mb-3"
          />
          <TextField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            inputClass="leading-[24px]"
            formGroup="mb-3"
          />
          <CustomButton
            extraClass="uppercase py-2.5 my-5 w-full"
            text="Submit"
            type="submit"
            loading={loading}
          />
          <Link
            href="/shop/login"
            className="block text-xs font-semibold text-center uppercase hover:underline"
          >
            Back to Login
          </Link>
        </CustomForm>
      </div>
      <CustomModal open={open} handleClose={() => setOpen(false)}>
        <>
          {success ? (
            <div className="">
              <LuCheckCircle className="text-5xl w-fit mx-auto mb-3" />
              <h2 className="text-center text-2xl font-medium">
                Password Reset Successfully
              </h2>
              <p className="mt-3 mb-5 text-center max-w-[350px] w-full mx-auto">
                Yaay!!! Your password has just been reset, now you can login
                with your new password.
              </p>
              <CustomButton
                text="Close"
                handleClick={() => {
                  setOpen(false), setSuccess(false);
                }}
                extraClass="w-fit mx-auto"
              />
            </div>
          ) : (
            <div className="">
              <RiErrorWarningLine className="text-5xl w-fit mx-auto mb-3" />
              <h2 className="text-center text-2xl font-medium">
                Password Reset Failed
              </h2>
              <p className="mt-3 mb-5 text-center max-w-[350px] w-full mx-auto">
                Attempt to reset password failed. {message}
              </p>
              <CustomButton
                text="Close"
                handleClick={() => {
                  setOpen(false), setSuccess(false);
                }}
                extraClass="w-fit mx-auto"
              />
            </div>
          )}
        </>
      </CustomModal>
    </div>
  );
}

export default page;
