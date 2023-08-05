import { baseUrl } from "@/server";
import { cookies } from "next/headers";

export const getSellerApiServer = async () => {
  const cookie = cookies().get("seller_token")?.value ?? "";
  try {
    const res = await fetch(`${baseUrl}/shop/get-seller`, {
      headers: { Cookie: `seller_token=${cookie}` },
    });
    return res.json();
  } catch (error) {
    return error;
  }
};

export const getSellerOrder = async (orderId: string) => {
  const cookie = cookies().get("seller_token")?.value ?? "";
  try {
    const res = await fetch(`${baseUrl}/order/get-seller-order/${orderId}`, {
      headers: { Cookie: `seller_token=${cookie}` },
    });
    if (!res.ok) {
      return undefined;
    }
    return await res.json();
  } catch (error) {
    return error;
  }
};
