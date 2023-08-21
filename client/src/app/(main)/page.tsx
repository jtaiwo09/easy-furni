import BestDeals from "@/components/BestDeals";
import HeroCarousel from "@/components/Carousel/HeroCarousel";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Loader from "@/components/Layout/Loader";
import NewProducts from "@/components/NewProducts";
import { getAllProducts } from "@/services/product";
import { notFound } from "next/navigation";

export default async function Home() {
  const data = await getAllProducts();
  if (!data) {
    notFound();
  }
  const products = data?.products;

  if (!products) return <Loader />;

  return (
    <div className="">
      <HeroCarousel />
      <NewProducts />
      <Categories products={products} />
      <BestDeals products={products} />
      <FeaturedProducts products={products} />
    </div>
  );
}
