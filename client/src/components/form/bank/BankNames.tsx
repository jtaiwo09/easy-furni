import FormHelperText from "@mui/material/FormHelperText";
import React from "react";
import { Controller } from "react-hook-form";
import DropdownList from "react-widgets/DropdownList";
import "@/app/globals.css";

interface IProps {
  control: any;
  errors: any;
  name: string;
  label?: string;
  formGroup?: string;
  data: any[];
}
function BankNames({ control, name, errors, data, label, formGroup }: IProps) {
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
        render={({ field }) => {
          const { onChange, ...rest } = field;
          return (
            <DropdownList
              dataKey="code"
              textField="name"
              data={data}
              {...rest}
              onChange={(v) => onChange(v.code)}
              className="!border-none"
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

export default BankNames;
