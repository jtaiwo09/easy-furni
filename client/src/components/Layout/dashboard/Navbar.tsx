"use client";
import Drawer from "@/components/modals/Drawer";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getSeller } from "@/redux/slices/sellerSlice";
import { sidebar } from "@/utils/data";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AiOutlineBars, AiOutlineGift } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { BsBagDash, BsBasket } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import { TfiShoppingCartFull } from "react-icons/tfi";
import { toast } from "react-toastify";

function Navbar({ token }: any) {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { seller } = useAppSelector((state) => state.seller);
  const path = usePathname();

  useEffect(() => {
    dispatch(getSeller())
      .unwrap()
      .then()
      .catch((err) => {
        toast.error(err.message);
      });
  }, [token]);

  const toggleModal = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div className="sticky top-0 bg-white w-full z-[98] px-5 sm:px-[30px] lg:px-[50px] align-center h-[70px] flex justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <button onClick={toggleModal} className="sm:hidden">
          <AiOutlineBars className="text-2xl" />
        </button>
        <Link
          href="/dashboard"
          className="uppercase inline-block font-semibold text-2xl"
        >
          JTK STORE
        </Link>
      </div>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Tooltip title="Coupon" className="!hidden sm:!inline-block">
          <IconButton
            aria-label="coupon"
            component={Link}
            href="/dashboard/coupons"
          >
            <AiOutlineGift className="2xl" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Products" className="!hidden sm:!inline-block">
          <IconButton
            aria-label="products"
            component={Link}
            href="/dashboard/products"
          >
            <BsBagDash className="2xl" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Orders" className="!hidden sm:!inline-block">
          <IconButton
            aria-label="orders"
            component={Link}
            href="/dashboard/orders"
          >
            <TfiShoppingCartFull className="2xl" />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title="Inbox">
          <IconButton
            aria-label="inbox"
            component={Link}
            href="/dashboard/inbox"
          >
            <BiMessageSquareDetail className="2xl" />
          </IconButton>
        </Tooltip> */}
        <Tooltip title="Profile">
          <>
            {seller ? (
              <Link href="/dashboard/settings">
                <Image
                  src={seller.avatar.url}
                  alt=""
                  width={40}
                  height={40}
                  className="w-[40px] h-[40px] rounded-full flex justify-center items-center border object-cover"
                />
              </Link>
            ) : (
              <RxAvatar size={40} />
            )}
          </>
        </Tooltip>
      </Stack>
      <Drawer open={open} anchor="left" toggleModal={toggleModal} width={300}>
        <ul className="mt-8">
          {sidebar &&
            sidebar.map((item, i) => (
              <Tooltip title={item.text} placement="right" key={i} arrow>
                <li
                  className={`mb-0.5 last:mb-0 hover:bg-[#f4f4f4] hover:text-text-hover ${
                    path === item.link && "bg-[#f4f4f4] text-text-hover"
                  }`}
                  onClick={toggleModal}
                >
                  <Link
                    href={item.link}
                    className="flex items-center py-4 px-6"
                  >
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
      </Drawer>
    </div>
  );
}

export default Navbar;
