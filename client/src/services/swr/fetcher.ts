import { baseUrl } from "@/server";

// General fetcher
export const FetcherApi = async ([url, page, limit]: any) => {
  const check = url.indexOf("?");
  const res = await fetch(
    `${baseUrl}/${url}${check !== -1 ? "&" : "?"}page=${page ?? 1}&limit=${
      limit ?? 10
    }`,
    {
      credentials: "include",
      next: { revalidate: 3 },
    }
  );
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error("Failed: Error Fetching Data");
  }
};
