"use client";
import React, { useState } from "react";
import Profile from "./Profile";
import IconButton from "@mui/material/IconButton";
import { BsChatLeftDots, BsHandbag, BsLock, BsPerson } from "react-icons/bs";
import { FaRegAddressBook } from "react-icons/fa";
import { AiOutlineLogin } from "react-icons/ai";
import { MdClose, MdOutlineTrackChanges } from "react-icons/md";
import { HiBars3 } from "react-icons/hi2";
import { useRouter, useSearchParams } from "next/navigation";
import Orders from "./Order/Orders";
import { useAppDispatch } from "@/redux/hook";
import { toast } from "react-toastify";
import Inbox from "./Inbox";
import TrackOrder from "./TrackOrder";
import ChangePassword from "./ChangePassword";
import Address from "./Address";
import { logout } from "@/redux/slices/userSlice";
import Refund from "./Order/Refund";

function currentTab(tab: any) {
  switch (tab) {
    case "profile":
      return <Profile />;
    case "orders":
      return <Orders />;
    case "inbox":
      return <Inbox />;
    case "track-order":
      return <TrackOrder />;
    case "refund":
      return <Refund />;
    case "change-password":
      return <ChangePassword />;
    case "address":
      return <Address />;
    default:
      return <Profile />;
  }
}

function Main() {
  const [open, setOpen] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };
  const handleRoute = (str: string) => {
    if (str) {
      router.push(`/profile?tab=${str}`);
      toggleSidebar();
    } else {
      router.push(`/profile`);
      toggleSidebar();
    }
  };
  const handleLogout = () => {
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
      onClick={() => setOpen(false)}
      className="flex-1 relative max-w-full sm:overflow-auto hide-scroll h-full"
    >
      <div className="mt-14 sm:mt-0">{currentTab(tab)}</div>
      <div
        onClick={(e) => {
          setOpen(true);
          e.stopPropagation();
        }}
        className="sm:hidden cursor-pointer group w-8 h-8 rounded-md border flex justify-center items-center bg-white shadow-md absolute top-2 left-2"
      >
        <HiBars3 className="text-lg group-hover:text-text-hover" />
      </div>
      <div
        className="sm:hidden"
        onClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        <div
          className={`${
            open ? "translate-x-[-30px]" : "-translate-x-[230px] "
          } z-10 transition-transform duration-500 h-fit w-[200px] border-b border-r shadow-md bg-white px-5 absolute top-0 bottom-0`}
        >
          <div className="w-full flex pt-2">
            <IconButton className="ml-auto group" onClick={toggleSidebar}>
              <MdClose className="text-lg group-hover:text-text-hover" />
            </IconButton>
          </div>
          <ul className="flex flex-col gap-2">
            <li
              onClick={() => {
                handleRoute("");
              }}
              className={`flex items-center py-2.5 hover:text-text-hover cursor-pointer ${
                !tab && "text-text-hover"
              }`}
            >
              <BsPerson className="text-lg" />
              <span className="inline-block ml-3 text-sm whitespace-nowrap font-medium">
                Profile
              </span>
            </li>
            <li
              onClick={() => {
                handleRoute("orders");
              }}
              className={`flex items-center py-2.5 hover:text-text-hover cursor-pointer ${
                tab === "orders" && "text-text-hover"
              }`}
            >
              <BsHandbag className="text-lg" />
              <span className="inline-block ml-3 text-sm whitespace-nowrap font-medium">
                Orders
              </span>
            </li>
            <li
              onClick={() => {
                handleRoute("inbox");
              }}
              className={`flex items-center py-2.5 hover:text-text-hover cursor-pointer ${
                tab === "inbox" && "text-text-hover"
              }`}
            >
              <BsChatLeftDots className="text-lg" />
              <span className="inline-block ml-3 text-sm whitespace-nowrap font-medium">
                Inbox
              </span>
            </li>
            <li
              onClick={() => {
                handleRoute("track-orders");
              }}
              className={`flex items-center py-2.5 hover:text-text-hover cursor-pointer ${
                tab === "track-orders" && "text-text-hover"
              }`}
            >
              <MdOutlineTrackChanges className="text-lg" />
              <span className="inline-block ml-3 text-sm whitespace-nowrap font-medium">
                Track Orders
              </span>
            </li>
            <li
              onClick={() => {
                handleRoute("change-password");
              }}
              className={`flex items-center py-2.5 hover:text-text-hover cursor-pointer ${
                tab === "change-password" && "text-text-hover"
              }`}
            >
              <BsLock className="text-lg" />
              <span className="inline-block ml-3 text-sm whitespace-nowrap font-medium">
                Change Password
              </span>
            </li>
            <li
              onClick={() => {
                handleRoute("address");
              }}
              className={`flex items-center py-2.5 hover:text-text-hover cursor-pointer ${
                tab === "address" && "text-text-hover"
              }`}
            >
              <FaRegAddressBook className="text-lg" />
              <span className="inline-block ml-3 text-sm whitespace-nowrap font-medium">
                Address
              </span>
            </li>
            <li
              onClick={handleLogout}
              className="flex items-center py-2.5 hover:text-text-hover cursor-pointer"
            >
              <AiOutlineLogin className="text-lg" />
              <span className="inline-block ml-3 text-sm whitespace-nowrap font-medium">
                Log Out
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Main;
