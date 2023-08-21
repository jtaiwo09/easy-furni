import { baseUrl } from "@/server";

// Update seller info -- seller
export const updateSellerInformationApi = async (data: any) => {
  const res = await fetch(`${baseUrl}/shop/update-seller-info`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (res.ok) {
    return result.shop;
  }
  throw new Error(result.message);
};

// Update seller info -- admin
export const updateSellerInformationAdminApi = async (
  data: any,
  shopId: string
) => {
  const res = await fetch(`${baseUrl}/shop/update-seller-info/${shopId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (res.ok) {
    return result.shop;
  }
  throw new Error(result.message);
};

// Update Seller Avatar
export const updateSellerAvatarApi = async (avatar: string) => {
  const res = await fetch(`${baseUrl}/shop/update-shop-avatar`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ avatar }),
  });
  const result = await res.json();
  if (res.ok) {
    return result.seller;
  }
  throw new Error(result.message);
};

// Create Seller Bank Account
export const createBankAccountApi = async (withdrawMethod: any) => {
  const res = await fetch(`${baseUrl}/shop/update-payment-methods`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ withdrawMethod }),
  });
  const result = await res.json();
  if (res.ok) {
    return result.seller;
  }
  throw new Error(result.message);
};

// Delete Seller Bank Account
export const deleteBankAccountApi = async () => {
  const res = await fetch(`${baseUrl}/shop/delete-withdraw-method`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await res.json();
  if (res.ok) {
    return result.seller;
  }
  throw new Error(result.message);
};

// Create withdrawal request
export const createWithdrawalRequestApi = async (data: { amount: number }) => {
  const res = await fetch(`${baseUrl}/withdraw/create-withdraw-request`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (res.ok) {
    return result.seller;
  }
  throw new Error(result.message);
};

// delete seller --- for admin
export const deleteSellerAdminApi = async (userId: string) => {
  const res = await fetch(`${baseUrl}/shop/delete-seller/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};
