"use client";
import CustomModal from "@/components/CustomModal";
import CustomButton from "@/components/form/CustomButton";
import CustomForm from "@/components/form/CustomForm";
import TextField from "@/components/form/TextField";
import { requestPasswordResetApi } from "@/services/user";
import Link from "next/link";
import React, { useState } from "react";
import { RiMailSendFill } from "react-icons/ri";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Must be a valid email address")
    .required("Email is required"),
});

function page() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: any, reset: any) => {
    setLoading(true);
    const res = await requestPasswordResetApi(data);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
    }
    reset();
  };
  return (
    <div className="flex justify-center min-h-[calc(100vh-70px)]">
      <div className="px-4 w-[500px] mt-[30%] sm:mt-[10%]">
        <h2 className="text-lg sm:text-[24px] leading-[24px] tracking-[0.5] text-[rgba(32,32,32,1)] font-bold mb-5 uppercase">
          Forgot Password
        </h2>
        <CustomForm
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={{ email: "" }}
        >
          <TextField
            name="email"
            label="Email address"
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
            href="/login"
            className="block text-xs font-semibold text-center uppercase hover:underline"
          >
            Back to Login
          </Link>
        </CustomForm>
      </div>
      <CustomModal open={success} handleClose={() => setSuccess(false)}>
        <div className="">
          <RiMailSendFill className="text-5xl w-fit mx-auto mb-3" />
          <h2 className="text-center text-2xl font-medium">Mail Sent</h2>
          <p className="mt-3 mb-5 text-center max-w-[350px] w-full mx-auto">
            A Reset password link has been sent to the, please click the link to
            reset your password
          </p>
          <CustomButton
            text="Close"
            handleClick={() => setSuccess(false)}
            extraClass="w-fit mx-auto"
          />
        </div>
      </CustomModal>
    </div>
  );
}

export default page;
