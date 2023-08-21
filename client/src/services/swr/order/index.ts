import useSWR from "swr";
import {
  getAllOrdersOfShopApi,
  getAllUsersOrdersApi,
  getUserOrderApi,
} from "./fetcher";

export const getAllUsersOrders = (userId: any) => {
  const { data, error, isLoading } = useSWR(
    `order/get-user-orders/${userId}`,
    getAllUsersOrdersApi
  );
  return { data, error, isLoading };
};

export const getUserOrder = (orderId: any) => {
  const { data, error, isLoading } = useSWR(
    `order/get-user-order/${orderId}`,
    getUserOrderApi
  );
  return { data, error, isLoading };
};

export const getAllOrdersOfShop = (shopId: any) => {
  const { data, error, isLoading } = useSWR(
    `order/get-seller-orders/${shopId}`,
    getAllOrdersOfShopApi
  );
  return { data, error, isLoading };
};
