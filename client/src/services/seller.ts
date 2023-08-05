import { baseUrl } from "@/server";

const getSellerApi = async () => {
  try {
    const res = await fetch(`${baseUrl}/shop/get-seller`, {
      credentials: "include",
    });
    return res;
  } catch (error) {
    return error;
  }
};

const getAllOrdersOfShop = async (shopId: string) => {
  try {
    const res = await fetch(`${baseUrl}/order/get-seller-orders/${shopId}`);
    const result = await res.json();
    return result.orders;
  } catch (error) {
    return error;
  }
};

export { getSellerApi, getAllOrdersOfShop };
