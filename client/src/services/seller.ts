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

const getAllOrdersOfShop = async (shopId: string, page = 1, limit = 10) => {
  try {
    const res = await fetch(
      `${baseUrl}/order/get-seller-orders/${shopId}?page=${page}&limit=${limit}`
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
    {
      credentials: "include",
    }
  );
  return res;
};

// delete seller --- for admin
const deleteSellerAdminApi = async (userId: string) => {
  const res = await fetch(`${baseUrl}/shop/delete-seller/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return res;
};

export {
  getSellerApi,
  getAllOrdersOfShop,
  getAllSellerAdminApi,
  deleteSellerAdminApi,
};
