import { FormHelperText } from "@mui/material";
import { type } from "os";
import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

interface IProps {
  name: string;
  inputClass?: string;
  formGroup?: string;
  label?: string;
  register?: any;
  errors?: any;
  placeholder?: string;
  type?: string;
}

const TextField = ({
  name,
  inputClass,
  formGroup,
  label,
  register,
  errors,
  placeholder,
  type,
}: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`${formGroup}`}>
      <label
        htmlFor={name}
        className="leading-[18px] text-sm font-medium block tracking-[0.5px] mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={type === "password" ? (showPassword ? "text" : type) : type}
          placeholder={placeholder}
          className={`leading-[30px] text-base border border-form-border pl-4 pr-5 py-[7px] shadow-none rounded-none bg-white w-full focus:outline-none ${inputClass}`}
          {...register(name)}
        />
        {type === "password" ? (
          <div
            className="absolute top-0 bottom-0 right-2 p-1 my-auto h-fit cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <BsEye className="text-xl" />
            ) : (
              <BsEyeSlash className="text-xl" />
            )}
          </div>
        ) : null}
      </div>
      <FormHelperText className="!text-red-500">
        {errors[name]?.message}
      </FormHelperText>
    </div>
  );
};

export default TextField;
