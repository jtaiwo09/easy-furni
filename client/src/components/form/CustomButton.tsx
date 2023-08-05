"use client";
import React from "react";
import { BiLoader } from "react-icons/bi";

interface IProps {
  text: string;
  loading?: boolean;
  disabled?: boolean;
  extraClass?: string;
  handleClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  children?: React.ReactNode;
  position?: string;
}
function CustomButton({
  text,
  loading,
  disabled,
  extraClass,
  handleClick,
  type = "button",
  children,
  position = "end",
}: IProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`hover:text-[rgba(32,32,32,1)] disabled:cursor-not-allowed flex items-center justify-center gap-1 hover:bg-white transition-all duration-300 bg-[rgba(32,32,32,1)] text-white border border-[rgba(32,32,32,1)] tracking-[0.5px] text-xs leading-[24px] font-bold uppercase px-6 py-[9px] shadow-none rounded-none cursor-pointer focus:outline-none min-w-[160px] whitespace-nowrap select-none ${extraClass}`}
      onClick={handleClick}
    >
      <span className={`${position === "start" ? "block" : "hidden"} mr-1`}>
        {children}
      </span>
      {loading ? <BiLoader className="text-2xl animate-spin" /> : null}
      {text}
      <span className={`${position === "end" ? "block" : "hidden"} ml-1`}>
        {children}
      </span>
    </button>
  );
}

export default CustomButton;
