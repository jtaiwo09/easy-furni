import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React from "react";
import { MdClose } from "react-icons/md";

interface IProps {
  open: boolean;
  hideCloseButton?: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  boxStyle?: string;
}

function CustomModal({
  open,
  handleClose,
  children,
  boxStyle,
  hideCloseButton = false,
}: IProps) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        className={`p-4 max-h-[80vh] overflow-y-auto absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] w-[90%] max-w-[600px] shadow-[24px] bg-white outline-none ${boxStyle}`}
      >
        {!hideCloseButton && (
          <MdClose
            onClick={handleClose}
            className="absolute top-2 right-2 ml-auto text-2xl cursor-pointer z-10 text-black/50 hover:text-black/100"
          />
        )}
        {children}
      </Box>
    </Modal>
  );
}

export default CustomModal;
