"use client";
import React, { useCallback, useState } from "react";
import {
  BsChatLeftDots,
  BsChevronLeft,
  BsHandbag,
  BsLock,
  BsPerson,
} from "react-icons/bs";
import { RiAdminLine } from "react-icons/ri";
import { FaRegAddressBook } from "react-icons/fa";
import { AiOutlineLogin } from "react-icons/ai";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hook";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Cookies from "universal-cookie";

interface IProp {
  extraClass?: string;
}
function Sidebar({ extraClass }: IProp) {
  const [open, setOpen] = useState(true);
  const { user } = useAppSelector((state) => state.user);

  const pathname = usePathname();

  const handleLogout = async () => {
    const cookies = new Cookies();
    cookies.remove("token", { path: "/" });
    await signOut({ callbackUrl: "/" });
  };
  const currentPath = useCallback(
    (path: string) => {
      return pathname === path ? "text-text-hover font-semibold" : "";
    },
    [pathname]
  );

  const nav = [
    {
      href: "/profile",
      icon: BsPerson,
      text: "Profile",
    },
    {
      href: "/orders",
      icon: BsHandbag,
      text: "Orders",
    },
    {
      href: "/inbox",
      icon: BsChatLeftDots,
      text: "Inbox",
    },
    {
      href: "/refund",
      icon: HiOutlineReceiptRefund,
      text: "Refund",
    },
    {
      href: "/change-password",
      icon: BsLock,
      text: "Change Password",
    },
    {
      href: "/address",
      icon: FaRegAddressBook,
      text: "Address",
    },
  ];
  return (
    <div
      className={`hidden sm:block relative shadow-sm rounded-sm border border-borderCol bg-white h-fit ${extraClass}`}
    >
      <div className="relative border-b border-borderCol p-4 w-full">
        <div
          onClick={() => setOpen((prev) => !prev)}
          className="cursor-pointer w-5 h-5 border border-primary flex justify-center items-center rounded-full ml-auto"
        >
          <BsChevronLeft
            className={`text-base text-primary transition-all duration-200 ${
              !open && "rotate-180"
            }`}
          />
        </div>
      </div>
      <ul className="mt-2 px-4 pb-5">
        {nav.map((item, i) => (
          <li key={i}>
            <Link
              href={item.href}
              className={`flex items-center font-medium py-2.5 hover:text-text-hover cursor-pointer ${currentPath(
                item.href
              )}`}
            >
              <item.icon className="text-xl" />
              {open ? (
                <span className="inline-block ml-3 min-w-[200px] whitespace-nowrap">
                  {item.text}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
        {user && user.role === "Admin" ? (
          <li>
            <Link
              href="/admin-dashboard"
              className={`flex items-center font-medium py-2.5 hover:text-text-hover cursor-pointer ${currentPath(
                "/admin-dashboard"
              )}`}
            >
              <RiAdminLine className="text-xl" />
              {open ? (
                <span className="inline-block ml-3 min-w-[200px] whitespace-nowrap">
                  Admin Dashboard
                </span>
              ) : null}
            </Link>
          </li>
        ) : null}
        <li
          onClick={handleLogout}
          className="flex items-center py-2.5 hover:text-text-hover cursor-pointer"
        >
          <AiOutlineLogin className="text-xl" />
          {open ? (
            <span className="inline-block ml-3 font-medium min-w-[200px] whitespace-nowrap">
              Log Out
            </span>
          ) : null}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
