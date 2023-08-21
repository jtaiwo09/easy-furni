import { baseUrl } from "@/server";

const fetchNewProduct = async (category: string) => {
  const res = await fetch(
    `${baseUrl}/product/get-all-products?category=${category}`
  );
  return res;
};

const createProductApi = async (data: any) => {
  try {
    const res = await fetch(`${baseUrl}/product/create-product`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};

const updateProductApi = async (data: any) => {
  const { productId, ...rest } = data;
  try {
    const res = await fetch(`${baseUrl}/product/update-product/${productId}`, {
      credentials: "include",
      method: "PUT",
      body: JSON.stringify({ ...rest }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};

async function getShopProducts(
  id: any,
  filterObject = {},
  page = 1,
  limit = 10
) {
  const params = new URLSearchParams(filterObject);
  const res = await fetch(
    `${baseUrl}/product/get-all-products-shop/${id}?${params}&page=${page}&limit=${limit}`
  );
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  if (result.message == "This page does not exist") {
    return null;
  }
  throw new Error(result.message);
}

async function getAProductApi(productId: any) {
  const res = await fetch(`${baseUrl}/product/get-single-product/${productId}`);
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return data.product;
}

async function getAllProducts(filterObject = {}, page = 1, limit = 10) {
  const params = new URLSearchParams(filterObject);
  const res = await fetch(
    `${baseUrl}/product/get-all-products?${params}&page=${page}&limit=${limit}`,
    {
      next: { revalidate: 3 },
    }
  );
  if (res.ok) {
    return await res.json();
  }
  return null;
}

async function createProductReviewApi(data: any) {
  const res = await fetch(`${baseUrl}/product/create-new-review`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

export {
  fetchNewProduct,
  createProductApi,
  getAProductApi,
  getAllProducts,
  getShopProducts,
  createProductReviewApi,
  updateProductApi,
};
