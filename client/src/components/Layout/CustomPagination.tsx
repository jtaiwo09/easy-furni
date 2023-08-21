"use client";
import Pagination from "@mui/material/Pagination";
import { useSearchParams } from "next/navigation";
import React from "react";

interface IProps {
  data: any;
  handleChangePage: any;
}
function CustomPagination({ data, handleChangePage }: IProps) {
  const count = data?.totalPages ?? 1;
  const totalRecord = data?.totalRecord;
  const searchParms = useSearchParams();
  const page = searchParms.get("page") ?? 1;

  if (totalRecord > 10)
    return (
      <div className="mt-4">
        <Pagination
          count={count}
          page={Number(page)}
          onChange={handleChangePage}
          shape="circular"
          color="primary"
          boundaryCount={2}
        />
      </div>
    );
}

export default CustomPagination;
