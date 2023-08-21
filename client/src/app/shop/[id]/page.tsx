import ShopInfo from "@/components/shop/ShopInfo";
import ShopProduct from "@/components/shop/ShopProduct";
import { getShopProducts } from "@/services/product";
import { getShopInfoApi } from "@/services/seller";
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
  const res = await getShopInfoApi(id);
  const shop: Shop = res.shop;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: shop.name,
    description: shop.description,
    openGraph: {
      images: [shop.avatar.url, ...previousImages],
    },
  };
}

export default async function page({
  params,
  searchParams,
}: {
  params: any;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const id = params.id;
  const page = searchParams["page"] ?? 1;
  delete searchParams["page"];
  const data = await getShopProducts(id, searchParams, Number(page));
  const shopData = await getShopInfoApi(id);

  return (
    <div className="pt-[70px]">
      <div className="bg-[#f4f4f4]">
        <div className="flex flex-col md:flex-row gap-4 container px-5 py-5 overflow-hidden relative">
          <ShopInfo data={shopData} products={data?.products} id={id} />
          <ShopProduct data={data} id={id} />
        </div>
      </div>
    </div>
  );
}
