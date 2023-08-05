import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import React from "react";
import { MdClose } from "react-icons/md";

interface IProps {
  open: boolean;
  toggleModal: () => void;
  children: React.ReactNode;
  boxStyle?: string;
  anchor?: "left" | "right" | "top" | "bottom";
  width?: number;
  showCloseBtn?: boolean;
}

function Drawer({
  open,
  toggleModal,
  children,
  boxStyle,
  width = 250,
  anchor = "right",
  showCloseBtn = true,
}: IProps) {
  return (
    <SwipeableDrawer
      anchor={anchor}
      open={open}
      onClose={toggleModal}
      onOpen={toggleModal}
    >
      <Box
        sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : width }}
        role="presentation"
        // onClick={toggleModal}
        // onKeyDown={toggleModal}
        className="relative"
      >
        {showCloseBtn ? (
          <IconButton
            onClick={toggleModal}
            className="absolute top-2 right-2 z-[999]"
          >
            <MdClose />
          </IconButton>
        ) : null}

        {children}
      </Box>
    </SwipeableDrawer>
  );
}

export default Drawer;
