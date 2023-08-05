"use client";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

function CustomBreadCrumb() {
  const pathname = usePathname();
  const crumb = pathname.split("/");

  const breadcrumbs = crumb.map((item, i) => {
    if (crumb.length - 1 === i) {
      return (
        <Typography key={i + 1} color="text.primary" className="capitalize">
          {item}
        </Typography>
      );
    }
    return (
      <Link
        key={i + 1}
        color="inherit"
        href={item === "" ? "/" : `/${item}`}
        className="capitalize hover:underline hover:decoration-inherit underline-offset-2"
      >
        {item === "" ? "Home" : item}
      </Link>
    );
  });

  return (
    <div className="py-5 sm:py-[30px] px-[30px] lg:px-[50px]">
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        className="container"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </div>
  );
}

export default CustomBreadCrumb;
