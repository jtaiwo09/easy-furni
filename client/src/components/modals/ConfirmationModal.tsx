import React from "react";
import CustomModal from "../CustomModal";
import CustomButton from "../form/CustomButton";

interface IProps {
  title: string;
  okText?: string;
  cancelText?: string;
  open: boolean;
  okBtn: () => void;
  cancelBtn: () => void;
  children: React.ReactNode;
  boxStyle?: string;
  okBtnClass?: string;
  cancelBtnClass?: string;
  loading?: boolean;
}
function ConfirmationModal({
  title,
  okText = "Submit",
  cancelText = "Cancel",
  open,
  okBtn,
  cancelBtn,
  children,
  boxStyle,
  okBtnClass,
  cancelBtnClass,
  loading,
}: IProps) {
  return (
    <CustomModal open={open} handleClose={cancelBtn} boxStyle={boxStyle}>
      <div className="">
        <h2 className="text-base mb-4 font-medium">{title}</h2>
        {children}
        <div className="flex items-center justify-end">
          <button
            onClick={cancelBtn}
            className={`text-base text-primary font-semibold mr-5 cursor-pointer ${cancelBtnClass}`}
          >
            {cancelText}
          </button>
          <CustomButton
            text={okText}
            handleClick={okBtn}
            extraClass={`${okBtnClass}`}
            loading={loading}
          />
        </div>
      </div>
    </CustomModal>
  );
}

export default ConfirmationModal;
