"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { adminSidebar } from "@/utils/data";
import Tooltip from "@mui/material/Tooltip";
import { usePathname } from "next/navigation";

function Sidebar() {
  const [open, setOpen] = useState(true);
  const path = usePathname();
  return (
    <div className="bg-white mt-4 h-[85vh] overflow-scroll !z-[90]">
      <div className="h-[50px] p-2 border-b">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full h-full flex justify-center items-center bg-transparent hover:bg-gray-100"
        >
          <HiChevronLeft className="text-lg text-gray-500" />
        </button>
      </div>
      <ul className="">
        {adminSidebar &&
          adminSidebar.map((item, i) => (
            <Tooltip title={item.text} placement="right" key={i} arrow>
              <li
                className={`mb-0.5 last:mb-0 hover:bg-[#f4f4f4] hover:text-text-hover ${
                  path === item.link && "bg-[#f4f4f4] text-text-hover"
                }`}
              >
                <Link href={item.link} className="flex items-center py-4 px-6">
                  <item.icon className="text-2xl" />
                  {open && (
                    <span className="ml-4 font-medium min-w-[150px]">
                      {item.text}
                    </span>
                  )}
                </Link>
              </li>
            </Tooltip>
          ))}
      </ul>
    </div>
  );
}

export default Sidebar;
