"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getSeller } from "@/redux/slices/sellerSlice";
import { getUser } from "@/redux/slices/userSlice";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";
import React, { useEffect } from "react";
import { AiOutlineGift } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { BsBagDash, BsBasket } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import { toast } from "react-toastify";

function Navbar({ token }: any) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  useEffect(() => {
    dispatch(getUser())
      .unwrap()
      .then()
      .catch((err) => {
        toast.error(err.message);
      });
  }, [token]);
  return (
    <div className="sticky top-0 bg-white w-full z-[98] px-5 sm:px-[30px] lg:px-[50px] align-center h-[70px] flex justify-between shadow-md">
      <Link
        href="/dashboard"
        className="uppercase inline-block font-semibold text-2xl"
      >
        Easy Furni
      </Link>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Tooltip title="Coupon">
          <IconButton aria-label="coupon" component={Link} href="#">
            <AiOutlineGift className="2xl" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Products">
          <IconButton aria-label="products" component={Link} href="#">
            <BsBagDash className="2xl" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Orders">
          <IconButton aria-label="orders" component={Link} href="#">
            <BsBasket className="2xl" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Inbox">
          <IconButton aria-label="inbox" component={Link} href="#">
            <BiMessageSquareDetail className="2xl" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Profile">
          <>
            {user ? (
              <Link href="/dashboard/settings">
                <img
                  src={user.avatar.url}
                  className="w-[40px] h-[40px] rounded-full flex justify-center items-center border object-cover"
                />
              </Link>
            ) : (
              <RxAvatar size={40} />
            )}
          </>
        </Tooltip>
      </Stack>
    </div>
  );
}

export default Navbar;
