import { baseUrl } from "@/server";

export const getUserOrder = async (orderId: string) => {
  try {
    const res = await fetch(`${baseUrl}/order/get-user-order/${orderId}`, {
      cache: "no-store",
    });
    return res.json();
  } catch (error) {
    return error;
  }
};
