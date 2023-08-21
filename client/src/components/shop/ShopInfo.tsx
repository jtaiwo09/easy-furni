"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { logout } from "@/redux/slices/userSlice";
import { formatDate } from "@/utils/helperFunc";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { toast } from "react-toastify";

interface IProp {
  data: {
    shop: Shop;
  };
  products: Product[];
  id: string;
}

function ShopInfo({ data: { shop }, products, id }: IProp) {
  const { seller } = useAppSelector((state) => state.seller);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const averageRating = totalRatings / totalReviewsLength || 0;

  const isOwner = seller && seller._id === id;

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
    <div className="rounded-md bg-white sticky top-0 w-full sm:w-[25%] min-w-[250px]">
      <div className="px-4 pt-10">
        <Image
          src={shop.avatar.url}
          alt=""
          width={140}
          height={140}
          className="rounded-full object-cover w-[140px] h-[140px] mx-auto"
        />
        <h1 className="text-center my-2 text-xl font-medium">{shop.name}</h1>
        <p className="text-sm text-primary/80 text-center">
          {shop.description}
        </p>
      </div>
      <ul className="p-4">
        <li className="mb-3">
          <span className="block font-semibold mb-1">Address</span>
          <span className="block text-primary/80">{shop.address}</span>
        </li>
        <li className="mb-3">
          <span className="block font-semibold mb-1">Phone Number</span>
          <a href={`tel:${shop.phoneNumber}`} className="block text-primary/80">
            {shop.phoneNumber}
          </a>
        </li>
        <li className="mb-3">
          <span className="block font-semibold mb-1">Total Products</span>
          <span className="block text-primary/80">
            {products && products.length}
          </span>
        </li>
        <li className="mb-3">
          <span className="block font-semibold mb-1">Shop Ratings</span>
          <span className="block text-primary/80">{averageRating}/5</span>
        </li>
        <li className="mb-3">
          <span className="block font-semibold mb-1">Date Joined</span>
          <span className="block text-primary/80">
            {formatDate(shop.createdAt)}
          </span>
        </li>
      </ul>
      {isOwner && (
        <div className="py-3 px-4 flex items-center space-x-3">
          <button
            onClick={handleLogout}
            className="py-2 px-4 bg-red-500 text-sm text-white font-semibold rounded-md uppercase"
          >
            Log Out
          </button>
          <Link
            href="/dashboard/settings"
            className="uppercase flex items-center gap-2 text-sm font-semibold"
          >
            Edit Shop
            <AiOutlineEdit className="text-lg" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default ShopInfo;
