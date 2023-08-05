import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import ProductDetailInfo from "@/components/ProductDetailInfo";
import ProductDetailItem from "@/components/ProductDetailItem";
import ProductReview from "@/components/ProductReview";
import { getAProductApi, getShopProducts } from "@/services/product";
import { notFound } from "next/navigation";
import React from "react";

export default async function page({ params: { id } }: any) {
  const productId = id;
  const data = await getAProductApi(productId);
  const res = await getShopProducts(data.shopId);
  const shopProducts: Product[] = res.products ?? [];

  const totalReviewsLength = shopProducts.reduce(
    (acc, product) => acc + product.reviews.length,
    0
  );

  const totalRatings = shopProducts.reduce(
    (acc, product) =>
      acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
    0
  );

  const avg = totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(1);

  if (!data) {
    notFound();
  }

  return (
    <div className="pt-[70px]">
      <CustomBreadCrumb />
      <div className="flex flex-col lg:flex-row gap-5 container px-[30px] lg:px-0">
        <div className="w-full lg:w-[40%] p-8  bg-[#f4f4f4] relative h-fit">
          <ProductDetailItem data={data.images} />
        </div>
        <ProductDetailInfo data={data} averageRating={averageRating} />
      </div>
      <div className="container my-8">
        <ProductReview
          data={data}
          totalReviewsLength={totalReviewsLength}
          averageRating={averageRating}
          sellersTotalProduct={shopProducts.length}
        />
      </div>
    </div>
  );
}
