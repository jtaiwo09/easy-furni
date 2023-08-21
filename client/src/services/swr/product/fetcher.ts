import { baseUrl } from "@/server";

export const createProductApi = async (data: any) => {
  const res = await fetch(`${baseUrl}/product/create-product`, {
    credentials: "include",
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
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
    credentials: "include",
    method: "PUT",
    body: JSON.stringify({ ...rest }),
    headers: {
      "Content-Type": "application/json",
    },
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
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};
