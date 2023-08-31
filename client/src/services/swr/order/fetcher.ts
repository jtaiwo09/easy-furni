import { baseUrl, userConfig, sellerConfig } from "@/server";

export const getAllUsersOrdersApi = async (url: string) => {
  const res = await fetch(`${baseUrl}/${url}`);
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};

export const getUserOrderApi = async (url: string) => {
  const res = await fetch(`${baseUrl}/${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};

export const getAllOrdersOfShopApi = async (url: string) => {
  const res = await fetch(`${baseUrl}/${url}`);
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};
