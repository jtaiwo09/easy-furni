import { SellerFormData } from "@/app/(seller)/dashboard/settings/page";
import {
  createBankAccountApi,
  deleteBankAccountApi,
  updateSellerInformationApi,
} from "../seller/fetcher";
import { AddPaymentMethod } from "@/app/(seller)/dashboard/payment/page";

// Update seller Info
export const updateMutation = async (newData: SellerFormData, seller: any) => {
  const updated = await updateSellerInformationApi(newData);
  return { ...seller, ...updated };
};

// Update Seller Bank Details
export const createBankMutation = async (
  newData: AddPaymentMethod,
  seller: any
) => {
  const updated = await createBankAccountApi(newData);
  return { ...seller, ...updated };
};

// Delete seller Bank Details
export const deleteBankMutation = async (seller: any) => {
  const updated = await deleteBankAccountApi();
  return { ...seller, ...updated };
};

// Update cache
export const sellerMutationOptions = (newData: any, seller: any) => {
  return {
    optimisticData: { ...seller, ...newData },
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};
