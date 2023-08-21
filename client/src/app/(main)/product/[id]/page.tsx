import CustomBreadCrumb from "@/components/CustomBreadCrumb";
import ProductDetailInfo from "@/components/ProductDetailInfo";
import ProductDetailItem from "@/components/ProductDetailItem";
import ProductReview from "@/components/ProductReview";
import { getAProductApi, getShopProducts } from "@/services/product";
import { notFound } from "next/navigation";
import React from "react";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const product = await getAProductApi(id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product?.name,
    description: product?.description,
    openGraph: {
      images: [product?.images[0]?.url, ...previousImages],
    },
  };
}

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
      <div className="flex flex-col lg:flex-row gap-5 container px-5 sm:px-[30px] lg:px-0">
        <div className="lg:w-[40%] sm:px-5  bg-[#f4f4f4] relative h-fit">
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
