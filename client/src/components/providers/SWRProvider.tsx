import React from "react";
import { SWRConfig } from "swr";

interface IProps {
  children: React.ReactNode;
}
function SWRProvider({ children }: IProps) {
  return <SWRConfig>{children}</SWRConfig>;
}

export default SWRProvider;
