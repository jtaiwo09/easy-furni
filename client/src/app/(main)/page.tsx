import BestDeals from "@/components/BestDeals";
import Carousel from "@/components/Carousel/Carousel";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import NewProducts from "@/components/NewProducts";
import { getAllProducts } from "@/services/product";

export default async function Home() {
  const data = await getAllProducts();

  return (
    <div className="">
      <Carousel />
      <NewProducts />
      <Categories products={data} />
      <BestDeals products={data} />
      <FeaturedProducts products={data} />
    </div>
  );
}
