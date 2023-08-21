"use client";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller } from "react-hook-form";
import WYSIWYGEditor from "./WYSIWYGEditor";

interface IProps {
  name: string;
  label: string;
  errors: any;
  control: any;
  formGroup: string;
}
function TextEditor({ name, label, control, errors, formGroup }: IProps) {
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
        render={({ field }) => <WYSIWYGEditor {...field} />}
      />
      <FormHelperText className="!text-red-500">
        {errors[name]?.message}
      </FormHelperText>
    </div>
  );
}

export default TextEditor;
