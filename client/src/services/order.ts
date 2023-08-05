import { baseUrl } from "@/server";

export const updateOrderStatus = async ({ id, status }: any) => {
  const res = await fetch(`${baseUrl}/order/update-order-status/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    return undefined;
  }
  return await res.json();
};

export const getAllUsersOrdersApi = async (userId: string) => {
  const res = await fetch(`${baseUrl}/order/get-user-orders/${userId}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res;
};

export const requestRefundApi = async (id: string) => {
  const res = await fetch(`${baseUrl}/order/order-refund/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: "Processing refund" }),
  });
  return await res.json();
};
