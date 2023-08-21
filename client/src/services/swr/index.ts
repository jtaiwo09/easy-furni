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
    FetcherApi,
    { errorRetryCount: 2 }
  );
  return { data, error, isLoading, mutate };
};
