"use client";
import Link from "next/link";
import React from "react";

function DashboardCard({ icon, text, link, value, linkText }: any) {
  return (
    <div className="bg-white rounded-md px-5 py-5 flex flex-col shadow-sm border">
      <div className="">
        <div className="flex items-center">
          <icon.label className="text-xl shrink-0 text-text-hover" />
          <span className="inline-block ml-3 text-base font-medium">
            {text}
          </span>
        </div>
        <p className="px-4 my-4 text-2xl font-semibold">{value}</p>
      </div>
      <Link
        href={link}
        className="inline-block mt-auto text-text-hover font-medium"
      >
        {linkText}
      </Link>
    </div>
  );
}

export default DashboardCard;
