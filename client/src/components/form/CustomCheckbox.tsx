import FormHelperText from "@mui/material/FormHelperText";
import React from "react";

interface IProps {
  formGroup?: string;
  name: string;
  label: string;
  register: any;
  errors: any;
}
function CustomCheckbox({ formGroup, name, label, register, errors }: IProps) {
  return (
    <div className={`${formGroup}`}>
      <input id={name} type="checkbox" {...register(name)} />
      <label
        htmlFor={name}
        className="leading-[18px] text-sm font-medium inline-block tracking-[0.5px] mb-1 ml-3"
      >
        {label}
      </label>
      <FormHelperText className="!text-red-500 mt-1 block">
        {errors[name]?.message}
      </FormHelperText>
    </div>
  );
}

export default CustomCheckbox;
