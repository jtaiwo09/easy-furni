import useSWR from "swr";
import { getSellerApi, getWithdrawalsApi } from "./fetcher";
import { updateSeller } from "@/redux/slices/sellerSlice";

export const getSeller = (dispatch: any) => {
  const { data, isLoading, error, mutate } = useSWR(
    "shop/get-seller",
    getSellerApi,
    {
      onSuccess: (data) => dispatch(updateSeller(data)),
    }
  );
  return { data, error, isLoading, mutate };
};

export const getWithdrawals = () => {
  const { data, isLoading, error, mutate } = useSWR(
    "withdraw/get-seller-withdrawals",
    getWithdrawalsApi
  );
  return { data, error, isLoading, mutate };
};
