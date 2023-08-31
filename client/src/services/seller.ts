import { baseUrl, sellerConfig, userConfig } from "@/server";

const getSellerApi = async () => {
  try {
    const res = await fetch(`${baseUrl}/shop/get-seller`, sellerConfig);
    return res;
  } catch (error) {
    return error;
  }
};

const getAllOrdersOfShop = async (shopId: string, page = 1, limit = 10) => {
  try {
    const res = await fetch(
      `${baseUrl}/order/get-seller-orders/${shopId}?page=${page}&limit=${limit}`,
      { next: { revalidate: 3 } }
    );
    const result = await res.json();
    return result;
  } catch (error) {
    return error;
  }
};

// get all sellers --- for admin
const getAllSellerAdminApi = async (page = 1, limit = 10) => {
  const res = await fetch(
    `${baseUrl}/shop/admin-all-sellers?page=${page}&limit=${limit}`,
    userConfig
  );
  return res;
};

// delete seller --- for admin
const deleteSellerAdminApi = async (userId: string) => {
  const res = await fetch(`${baseUrl}/shop/delete-seller/${userId}`, {
    method: "DELETE",
    ...userConfig,
  });
  return res;
};

// get a shop info
const getShopInfoApi = async (shopId: any) => {
  const res = await fetch(`${baseUrl}/shop/get-shop-info/${shopId}`);
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};

const shopRequestPasswordResetApi = async (data: any) => {
  const res = await fetch(`${baseUrl}/shop/request-reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};

const shopResetPasswordApi = async (data: any) => {
  const res = await fetch(`${baseUrl}/shop/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};

export {
  getSellerApi,
  getAllOrdersOfShop,
  getAllSellerAdminApi,
  deleteSellerAdminApi,
  getShopInfoApi,
  shopRequestPasswordResetApi,
  shopResetPasswordApi,
};
