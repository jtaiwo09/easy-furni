import { styled } from "@mui/material/styles";
import MuiLinearProgress from "@mui/material/LinearProgress";
import React from "react";

const LinearProgress = styled(MuiLinearProgress)(() => ({
  "& .MuiLinearProgress-bar": {
    backgroundColor: "#2463EB",
  },
}));

interface IProps {
  loading: boolean;
}
function CustomProgressBar({ loading }: IProps) {
  return loading && <LinearProgress />;
}

export default CustomProgressBar;
