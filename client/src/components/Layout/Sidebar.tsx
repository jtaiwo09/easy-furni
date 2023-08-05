"use client";
import React, { useState } from "react";
import {
  BsChatLeftDots,
  BsChevronLeft,
  BsHandbag,
  BsLock,
  BsPerson,
} from "react-icons/bs";
import { MdOutlineTrackChanges } from "react-icons/md";
import { FaRegAddressBook } from "react-icons/fa";
import { AiOutlineLogin } from "react-icons/ai";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/hook";
import { logoutUser } from "@/services/auth";
import { logout } from "@/redux/slices/userSlice";
import { HiOutlineReceiptRefund } from "react-icons/hi";

interface IProp {
  extraClass?: string;
}
function Sidebar({ extraClass }: IProp) {
  const [open, setOpen] = useState(true);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const handleRoute = (str: string) => {
    if (str) {
      router.push(`/profile?tab=${str}`);
    } else {
      router.push(`/profile`);
    }
  };

  const handleLogout = async () => {
    dispatch(logout())
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success(res.message);
          router.push("/");
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
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
        <li
          onClick={() => handleRoute("")}
          className={`flex items-center py-2.5 hover:text-text-hover cursor-pointer ${
            !tab && "text-text-hover font-semibold"
          }`}
        >
          <BsPerson className="text-xl" />
          {open ? (
            <span className="inline-block ml-3 min-w-[200px] whitespace-nowrap">
              Profile
            </span>
          ) : null}
        </li>
        <li
          onClick={() => handleRoute("orders")}
          className={`flex items-center py-2.5 hover:text-text-hover cursor-pointer ${
            tab === "orders" && "text-text-hover font-semibold"
          }`}
        >
          <BsHandbag className="text-xl" />
          {open ? (
            <span className="inline-block ml-3 min-w-[200px] whitespace-nowrap">
              Orders
            </span>
          ) : null}
        </li>
        <li
          onClick={() => handleRoute("inbox")}
          className={`flex items-center py-2.5 hover:text-text-hover cursor-pointer ${
            tab === "inbox" && "text-text-hover font-semibold"
          }`}
        >
          <BsChatLeftDots className="text-xl" />
          {open ? (
            <span className="inline-block ml-3 min-w-[200px] whitespace-nowrap">
              Inbox
            </span>
          ) : null}
        </li>
        <li
          onClick={() => handleRoute("track-order")}
          className={`flex items-center py-2.5 hover:text-text-hover cursor-pointer ${
            tab === "track-order" && "text-text-hover font-semibold"
          }`}
        >
          <MdOutlineTrackChanges className="text-xl" />
          {open ? (
            <span className="inline-block ml-3 min-w-[200px] whitespace-nowrap">
              Track Order
            </span>
          ) : null}
        </li>
        <li
          onClick={() => handleRoute("refund")}
          className={`flex items-center py-2.5 hover:text-text-hover cursor-pointer ${
            tab === "refund" && "text-text-hover font-semibold"
          }`}
        >
          <HiOutlineReceiptRefund className="text-xl" />
          {open ? (
            <span className="inline-block ml-3 min-w-[200px] whitespace-nowrap">
              Refund
            </span>
          ) : null}
        </li>
        <li
          onClick={() => handleRoute("change-password")}
          className={`flex items-center py-2.5 hover:text-text-hover cursor-pointer ${
            tab === "change-password" && "text-text-hover font-semibold"
          }`}
        >
          <BsLock className="text-xl" />
          {open ? (
            <span className="inline-block ml-3 min-w-[200px] whitespace-nowrap">
              Change Password
            </span>
          ) : null}
        </li>
        <li
          onClick={() => handleRoute("address")}
          className={`flex items-center py-2.5 hover:text-text-hover cursor-pointer ${
            tab === "address" && "text-text-hover font-semibold"
          }`}
        >
          <FaRegAddressBook className="text-xl" />
          {open ? (
            <span className="inline-block ml-3 min-w-[200px] whitespace-nowrap">
              Address
            </span>
          ) : null}
        </li>
        <li
          onClick={handleLogout}
          className="flex items-center py-2.5 hover:text-text-hover cursor-pointer"
        >
          <AiOutlineLogin className="text-xl" />
          {open ? (
            <span className="inline-block ml-3 min-w-[200px] whitespace-nowrap">
              Log Out
            </span>
          ) : null}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
