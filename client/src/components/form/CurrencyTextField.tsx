import { FormHelperText } from "@mui/material";
import React from "react";
import CurrencyInput from "react-currency-input-field";
import { Controller } from "react-hook-form";

interface IProps {
  label?: string;
  name?: any;
  control: any;
  errors: any;
  formGroup?: string;
  placeholder?: string;
}
function CurrencyTextField({
  label,
  name,
  control,
  errors,
  formGroup,
  placeholder,
}: IProps) {
  const handleChange = (value: any, onChange: any) => {
    onChange(value);
  };
  return (
    <div className={`${formGroup}`}>
      <label
        htmlFor={name}
        className="leading-[18px] text-sm font-medium block tracking-[0.5px] mb-1"
      >
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, ...rest } }) => {
          return (
            <CurrencyInput
              id={name}
              {...rest}
              placeholder={placeholder}
              onValueChange={(value) => {
                onChange(value);
              }}
              className="h-[46px] border border-form-border w-full focus:outline-none rounded-none px-4"
              intlConfig={{ locale: "en-NG", currency: "NGN" }}
            />
          );
        }}
      />
      <FormHelperText className="!text-red-500">
        {errors[name]?.message}
      </FormHelperText>
    </div>
  );
}

export default CurrencyTextField;
