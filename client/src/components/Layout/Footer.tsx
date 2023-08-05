"use";
import Link from "next/link";
import React from "react";
import { GrFacebookOption, GrTwitter, GrInstagram } from "react-icons/gr";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { HiOutlineEnvelope, HiOutlinePhone } from "react-icons/hi2";
import { BsSend } from "react-icons/bs";

function Footer() {
  return (
    <div className="bg-primary text-white w-full mt-auto">
      <div className="max-w-[1230px] w-full mx-auto px-5 md:px-7 text-[#ccc] pt-[60px] pb-[18px] flex flex-col lg:flex-row gap-6 justify-between">
        <div className="px-4">
          <Link
            href="#"
            className="uppercase mb-5 inline-block text-xl font-semibold text-white"
          >
            Easy furni
          </Link>
          <ul className="text-[#ccc]">
            <li className="flex items-center mb-5">
              <HiOutlineLocationMarker className="text-lg mr-4" />
              <span className="inline-block text-sm">
                4, olufemi close, Idimu close...
              </span>
            </li>
            <li className="flex items-center mb-5">
              <HiOutlineEnvelope className="text-lg mr-4" />
              <span className="inline-block text-sm">easyfurni@gmail.com</span>
            </li>
            <li className="flex items-center mb-5">
              <HiOutlinePhone className="text-lg mr-4" />
              <span className="inline-block text-sm">+2347067729362</span>
            </li>
          </ul>
          <ul className="flex gap-4 mb-2">
            <li>
              <Link href="#">
                <GrFacebookOption className="text-white" />
              </Link>
            </li>
            <li>
              <Link href="#">
                <GrTwitter className="text-white" />
              </Link>
            </li>
            <li>
              <Link href="#">
                <GrInstagram className="text-white" />
              </Link>
            </li>
          </ul>
        </div>
        <ul className="text-sm px-4">
          <li className="mb-4">
            <Link href="#" className="inline-block">
              About Us
            </Link>
          </li>
          <li className="mb-4">
            <Link href="#" className="inline-block">
              Delivery Info
            </Link>
          </li>
          <li className="mb-4">
            <Link href="#" className="inline-block">
              Order Tracking
            </Link>
          </li>
          <li className="mb-4">
            <Link href="#" className="inline-block">
              My Account
            </Link>
          </li>
          <li className="mb-4">
            <Link href="#" className="inline-block">
              Help
            </Link>
          </li>
        </ul>
        <div className="text-white lg:max-w-[380px] w-full px-4">
          <h1 className="uppercase text-xl mb-4 font-semibold">Newsletter</h1>
          <p className="text-sm">
            Enjoy our newsletter to stay updated with the latest news and
            special sales.
          </p>
          <form action="" className="mt-4">
            <div className="flex border-b border-borderCol">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-transparent focus:outline-none border-none py-2 text-sm pl-1"
              />
              <button className="px-3 py-2">
                <BsSend />
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="border-t border-borderCol/50 w-full px-5 md:px-7 py-6 text-center text-sm">
        © Easy Furni. All Rights Reserved.
      </div>
    </div>
  );
}

export default Footer;
