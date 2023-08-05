"use client";
import CustomButton from "@/components/form/CustomButton";
import TextField from "@/components/form/TextField";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import React, { useEffect } from "react";
import * as yup from "yup";
import CustomForm from "@/components/form/CustomForm";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { login } from "@/redux/slices/sellerSlice";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Must be a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export type SellerLoginFormData = {
  email: string;
  password: string;
};

function page() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isSeller, loading } = useAppSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller) {
      router.push("/dashboard");
    }
  }, [isSeller]);

  const onSubmit = async (data: any, reset: any) => {
    dispatch(login(data))
      .unwrap()
      .then(() => {
        toast.success("Login successful");
        router.push("/dashboard");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="flex justify-center min-h-[calc(100vh-70px)]">
      <div className="px-4 w-[500px] mt-[15%] sm:mt-[10%]">
        <h2 className="text-[24px] leading-[24px] tracking-[0.5] text-[rgba(32,32,32,1)] font-bold mb-5 text-center uppercase">
          Login to your shop
        </h2>
        <CustomForm
          schema={schema}
          onSubmit={onSubmit}
          defaultValues={{ email: "", password: "" }}
        >
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
            formGroup="mb-3"
          />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            mb={2}
          >
            <label htmlFor="remember">
              <input id="remember" type="checkbox" className="mr-2" />
              Remember me
            </label>
            <Link href="#" className="hover:underline underline-offset-2">
              Lost your password?
            </Link>
          </Stack>
          <CustomButton
            extraClass="uppercase py-2.5 my-5 w-full"
            text="Log In"
            type="submit"
            loading={loading}
          />
          <p className="mt-2.5">
            Don't have an account?{" "}
            <Link
              href="/shop-create"
              className="hover:underline underline-offset-2 text-blue-600 "
            >
              Sign Up
            </Link>
          </p>
        </CustomForm>
      </div>
    </div>
  );
}

export default page;
