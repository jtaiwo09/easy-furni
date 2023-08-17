import { baseUrl } from "@/server";

// delete withdraal request --- for admin
export const deleteWithdrawalRequestAdminApi = async ({
  id,
  sellerId,
}: any) => {
  const res = await fetch(`${baseUrl}/withdraw/delete-withdraw-request/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sellerId }),
  });
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};

// update withdraal request --- for admin
export const updateWithdrawalRequestAdminApi = async ({
  id,
  sellerId,
}: any) => {
  const res = await fetch(`${baseUrl}/withdraw/update-withdraw-request/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sellerId }),
  });
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};
