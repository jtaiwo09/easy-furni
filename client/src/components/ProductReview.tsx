"use client";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useEffect, useState } from "react";
import CustomTabPanel from "./CustomTabPanel";
import Link from "next/link";
import CustomButton from "./form/CustomButton";
import { formatDate } from "@/utils/helperFunc";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function ProductReview({
  data,
  totalReviewsLength,
  averageRating,
  sellersTotalProduct,
}: {
  data: Product;
  totalReviewsLength: number;
  averageRating: string;
  sellersTotalProduct: number;
}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Product Preview"
            allowScrollButtonsMobile
            variant="scrollable"
          >
            <Tab label="Product Details" {...a11yProps(0)} />
            <Tab label="Additional Information" {...a11yProps(1)} />
            <Tab label="Product Reviews" {...a11yProps(2)} />
            <Tab label="Seller Information" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <p dangerouslySetInnerHTML={{ __html: data.description }}></p>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <table className="border border-borderCol p-5 w-full">
            <tr className="border-b">
              <th className="text-left p-5">weight</th>
              <td className="text-left">10kg</td>
            </tr>
            <tr className="border-b">
              <th className="text-left p-5">Dimensions</th>
              <td className="text-left"> 10 × 10 × 10 cm</td>
            </tr>
            <tr className="">
              <th className="text-left p-5">Material</th>
              <td className="text-left"> Velvet</td>
            </tr>
          </table>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          {data.reviews.length > 0 ? (
            <>
              {data.reviews.map((review) => (
                <div key={review._id} className="flex gap-3 mb-5">
                  <img
                    src={review.user.avatar.url}
                    alt=""
                    className="w-[45px] h-[45px] rounded-full object-cover"
                  />
                  <div className="">
                    <p className="flex items-center">
                      {review.user.name}
                      <Rating
                        name="read-only"
                        value={review.rating}
                        precision={0.5}
                        readOnly
                        size="medium"
                        className="ml-4"
                      />
                    </p>
                    <p className="mt-1">{review.comment}</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="">No Review</p>
          )}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <div className="flex justify-between gap-5 flex-wrap">
            <div className="flex gap-2">
              <img
                src={data.shop.avatar.url}
                alt=""
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
              <div className="">
                <Link
                  href="#"
                  className="block mb-1 hover:underline underline-offset-2"
                >
                  {data.shop.name}
                </Link>
                <p className="">({averageRating}/5) Ratings</p>
              </div>
            </div>
            <div className="">
              <p className="mb-2">
                <span className="font-semibold">Date Joined:</span>{" "}
                {formatDate(data.shop.createdAt)}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Total Products:</span>{" "}
                {sellersTotalProduct}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Total Reviews:</span>{" "}
                {totalReviewsLength}
              </p>
              <CustomButton text="Visit Shop" />
            </div>
          </div>
        </CustomTabPanel>
      </Box>
    </div>
  );
}

export default ProductReview;
