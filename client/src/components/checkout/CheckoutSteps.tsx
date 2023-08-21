"use client";
import {
  Step,
  StepConnector,
  StepIconProps,
  StepLabel,
  Stepper,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#784af4",
    }),
    "& .QontoStepIcon-completedIcon": {
      color: "#784af4",
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon !text-green-500" />
      ) : (
        <div className="QontoStepIcon-circle text-[#f63b60]" />
      )}
    </QontoStepIconRoot>
  );
}

const CheckoutSteps = ({ active }: { active: number }) => {
  return (
    <>
      <div className="w-full sm:flex justify-center hidden">
        <div className="w-fit flex items-center flex-wrap">
          <div className="flex items-center">
            <div className="px-[20px] h-[38px] rounded-[20px] bg-[#f63b60] flex items-center justify-center cursor-pointer">
              <span className="text-[#fff] text-[16px] font-[600]">
                1.Shipping
              </span>
            </div>
            <div
              className={`${
                active > 1
                  ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f63b60]"
                  : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#FDE1E6]"
              }`}
            />
          </div>

          <div className="flex items-center">
            <div
              className={`px-[20px] h-[38px] rounded-[20px] bg-[#f63b60] flex items-center justify-center cursor-pointer ${
                active > 1 ? "" : "!bg-[#FDE1E6]"
              }`}
            >
              <span
                className={`text-[#fff] text-[16px] font-[600] ${
                  active > 1 ? "" : "!text-[#f63b60]"
                }`}
              >
                2.Payment
              </span>
            </div>
            <div
              className={`${
                active > 2
                  ? "w-[30px] 800px:w-[70px] h-[4px] !bg-[#f63b60]"
                  : "w-[30px] 800px:w-[70px] h-[4px] !bg-[#FDE1E6]"
              }`}
            />
          </div>

          <div className="flex items-center">
            <div
              className={`px-[20px] h-[38px] rounded-[20px] bg-[#f63b60] flex items-center justify-center cursor-pointer ${
                active > 2 ? "" : "!bg-[#FDE1E6]"
              }`}
            >
              <span
                className={`text-[#fff] text-[16px] font-[600] ${
                  active > 2 ? "" : "!text-[#f63b60]"
                }`}
              >
                3.Success
              </span>
            </div>
          </div>
        </div>
      </div>
      <Stepper
        alternativeLabel
        activeStep={active}
        connector={<StepConnector />}
        className="sm:!hidden"
      >
        {["Shipping", "Payment", "Success"].map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </>
  );
};

export default CheckoutSteps;
