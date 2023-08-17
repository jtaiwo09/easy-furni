import useSWR from "swr";
import { FetcherApi } from "./fetcher";

export interface FetcherProps {
  url: string;
  page?: number;
  limit?: number;
  id?: string;
}

// General Fetcher
export const Fetcher = ({ url, page, limit }: FetcherProps) => {
  const { data, isLoading, error, mutate } = useSWR(
    [url, page, limit],
    FetcherApi
  );
  return { data, error, isLoading, mutate };
};

// Dynamic Fetcher
// export const DynamicFetcher = ({ url, id, page }: FetcherProps) => {
//   const { data, isLoading, error, mutate } = useSWR([url, id], DynamicFetcherApi);
//   return { data, error, isLoading, mutate };
// };
