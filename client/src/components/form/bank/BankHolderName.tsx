import { nameInquiry } from "@/services";
import FormHelperText from "@mui/material/FormHelperText";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

interface IProps {
  name: string;
  inputClass?: string;
  formGroup?: string;
  label?: string;
  register?: any;
  errors?: any;
  placeholder?: string;
  type?: string;
  bankAccountNumber: any;
  bankName: any;
  setValue: any;
  setDeleteLoader: any;
}

const TextFieldBankHolderName = ({
  name,
  inputClass,
  formGroup,
  label,
  register,
  errors,
  placeholder,
  bankAccountNumber,
  bankName,
  setValue,
  setDeleteLoader,
}: IProps) => {
  useEffect(() => {
    async function confirmName() {
      setDeleteLoader(true);
      try {
        const res = await nameInquiry(bankAccountNumber, bankName);
        setValue(name, res.account_name);
        setDeleteLoader(false);
      } catch (error: any) {
        setDeleteLoader(false);
        setValue(name, "");
        toast.error(error.message);
      }
    }

    if (bankAccountNumber.length == 10) {
      confirmName();
    }
  }, [bankAccountNumber, bankName]);

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
          disabled
          placeholder={placeholder}
          className={`leading-[30px] disabled:bg-gray-50 disabled:cursor-not-allowed text-base border border-form-border pl-4 pr-5 py-[7px] shadow-none rounded-none bg-white w-full focus:outline-none ${inputClass}`}
          {...register(name)}
        />
      </div>
      <FormHelperText className="!text-red-500">
        {errors[name]?.message}
      </FormHelperText>
    </div>
  );
};

export default TextFieldBankHolderName;
