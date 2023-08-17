"use client";
import Pagination from "@mui/material/Pagination";
import React from "react";

function CustomPagination({ data, handleChangePage, page }: any) {
  const count = data?.totalPages ?? 1;
  const totalRecord = data?.totalRecord;

  if (totalRecord > 10)
    return (
      <div className="mt-4">
        <Pagination
          count={count}
          page={page}
          onChange={handleChangePage}
          shape="circular"
          color="primary"
          boundaryCount={2}
        />
      </div>
    );
}

export default CustomPagination;
