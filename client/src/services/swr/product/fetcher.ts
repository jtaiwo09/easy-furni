import { baseUrl, sellerConfig } from "@/server";

export const createProductApi = async (data: any) => {
  const res = await fetch(`${baseUrl}/product/create-product`, {
    method: "POST",
    body: JSON.stringify(data),
    ...sellerConfig,
  });
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};

export const updateProductApi = async (data: any) => {
  const { productId, ...rest } = data;
  const res = await fetch(`${baseUrl}/product/update-product/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ ...rest }),
    ...sellerConfig,
  });
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};

export const deleteProductApi = async (productId: string) => {
  const res = await fetch(
    `${baseUrl}/product/delete-shop-product/${productId}`,
    {
      method: "DELETE",
      ...sellerConfig,
    }
  );
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};
