"use client";
import CustomButton from "@/components/form/CustomButton";
import TextField from "@/components/form/TextField";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import CustomForm from "@/components/form/CustomForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { login } from "@/redux/slices/userSlice";
import Alert from "@mui/material/Alert";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Must be a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export type LoginFormData = {
  email: string;
  password: string;
};

function page() {
  const router = useRouter();
  const { isAuthenticated, error } = useAppSelector((state) => state.user);
  const [loader, setLoader] = useState(false);
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      const path = searchParams.get("redirect");
      if (path) {
        router.push(path);
      } else {
        router.push("/");
      }
    }
  }, [isAuthenticated]);

  const onSubmit = async (data: any, reset: any) => {
    setLoader(true);
    dispatch(login(data))
      .unwrap()
      .then(() => {
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  return (
    <div className="flex justify-center min-h-[calc(100vh-70px)]">
      <div className="px-4 w-[500px] mt-[15%] sm:mt-[10%]">
        <h2 className="text-[24px] leading-[24px] tracking-[0.5] text-[rgba(32,32,32,1)] font-bold mb-5">
          Login
        </h2>
        <>
          {error && (
            <Alert severity="error" className="mb-5">
              {error?.message}
            </Alert>
          )}

          {isAuthenticated && (
            <Alert severity="success" className="mb-5">
              Logged in successfully
            </Alert>
          )}
        </>
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
            justifyContent="flex-end"
            spacing={2}
            mb={2}
          >
            {/* <label htmlFor="remember">
              <input id="remember" type="checkbox" className="mr-2" />
              Remember me
            </label> */}
            <Link
              href="/forgot-password"
              className="hover:underline underline-offset-2 text-sm"
            >
              Forgot your password?
            </Link>
          </Stack>
          <CustomButton
            extraClass="uppercase py-2.5 my-5 w-full"
            text="Log In"
            type="submit"
            loading={loader}
          />
          <p className="mt-2.5 text-sm">
            Don't have an account?{" "}
            <Link
              href="/signup"
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
