import FormHelperText from "@mui/material/FormHelperText";
import React from "react";

function CustomSelect({
  register,
  options,
  name,
  defaultText,
  errors,
  formGroup,
  label,
}: any) {
  return (
    <div className={`${formGroup}`}>
      <label
        htmlFor={name}
        className="leading-[18px] text-sm font-medium block tracking-[0.5px] mb-1"
      >
        {label}
      </label>
      <select
        name={name}
        {...register(name)}
        className={`w-full border border-form-border h-[46px] focus:outline-none px-2`}
      >
        <option value="">{defaultText}</option>
        {options &&
          options.map((item: any) => (
            <option key={item.title} value={item.title}>
              {item.title}
            </option>
          ))}
      </select>

      <FormHelperText className="!text-red-500">
        {errors[name]?.message}
      </FormHelperText>
    </div>
  );
}

export default CustomSelect;
