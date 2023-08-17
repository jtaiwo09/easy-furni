import { baseUrl } from "@/server";

// General fetcher
export const FetcherApi = async ([url, page, limit]: any) => {
  const res = await fetch(
    `${baseUrl}/${url}?page=${page ?? 1}&limit=${limit ?? 10}`,
    {
      credentials: "include",
    }
  );
  const result = await res.json();
  if (res.ok) {
    return result;
  } else {
    throw new Error(result.message);
  }
};

// General fetcher
// export const DynamicFetcherApi = async ([url, id, page, limit]: any) => {
//   const res = await fetch(
//     `${baseUrl}/${url}/${id}?page=${page ?? 1}&limit=${limit ?? 10}`,
//     {
//       credentials: "include",
//     }
//   );
//   const result = await res.json();
//   if (res.ok) {
//     return result;
//   } else {
//     throw new Error(result.message);
//   }
// };
