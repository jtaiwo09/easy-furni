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

async function getShopProducts(id: any) {
  const res = await fetch(`${baseUrl}/product/get-all-products-shop/${id}`);
  if (res.ok) {
    return res.json();
  }
  return null;
}

async function getAProductApi(productId: any) {
  const res = await fetch(`${baseUrl}/product/get-single-product/${productId}`);
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  return data.product;
}

async function getAllProducts() {
  const res = await fetch(`${baseUrl}/product/get-all-products`);
  if (res.ok) {
    const data = await res.json();
    return data.products;
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
};
