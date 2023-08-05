"use client";
import CustomButton from "@/components/form/CustomButton";
import TextField from "@/components/form/TextField";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import CustomForm from "@/components/form/CustomForm";
import Upload from "@/components/form/Upload";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signup } from "@/services/auth";
import { useAppSelector } from "@/redux/hook";

const schema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .email("Must be a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be atleast 6 characters")
    .required("Password is required"),
  avatar: yup
    .mixed()
    .nullable()
    .test("fileSize", "File size must not be more than 8mb", (value: any) => {
      const base64str = value.split("base64,")[1];
      const decoded = atob(base64str ?? "");
      return !value || (value && decoded.length <= 8000000);
    })
    .test("checkIfEmpty", "Please upload an image", (v) => v !== ""),
});

export type FormData = {
  name: string;
  email: string;
  password: string;
  avatar: any;
};

function page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: any, reset: any) => {
    setIsLoading(true);
    const res = (await signup(data)) as any;
    const result = await res.json();
    setIsLoading(false);
    if (res.ok) {
      toast.success(result.message);
      router.push("/login");
      reset();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex justify-center min-h-[calc(100vh-70px)]">
      <div className="px-4 w-[500px] mt-[10%] sm:mt-[5%]">
        <h2 className="text-[24px] leading-[24px] tracking-[0.5] text-[rgba(32,32,32,1)] font-bold mb-5">
          Sign Up
        </h2>
        <CustomForm
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={{ name: "", email: "", password: "", avatar: "" }}
        >
          <TextField
            name="name"
            label="Full Name"
            inputClass="leading-[24px]"
            formGroup="mb-3"
          />
          <TextField
            name="email"
            label="Email address"
            inputClass="leading-[24px]"
            formGroup="mb-3"
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            inputClass="leading-[24px]"
            formGroup=""
          />
          <Upload label="avatar" />

          <CustomButton
            extraClass="uppercase py-2.5 my-5 w-full"
            text="Sign Up"
            type="submit"
            loading={isLoading}
          />
          <p className="">
            Already have an account?{" "}
            <Link
              href="/login"
              className="hover:underline underline-offset-2 text-blue-600 "
            >
              Login
            </Link>
          </p>
        </CustomForm>
      </div>
    </div>
  );
}

export default page;
