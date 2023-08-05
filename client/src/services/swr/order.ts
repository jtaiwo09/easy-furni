import { baseUrl } from "@/server";
import useSWR from "swr";

const getAllUsersOrdersApi = async (url: string) => {
  const res = await fetch(`${baseUrl}/${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

export const getAllUsersOrders = (userId: any) => {
  const { data, error, isLoading } = useSWR(
    `order/get-user-orders/${userId}`,
    getAllUsersOrdersApi
  );
  return { data, error, isLoading };
};
