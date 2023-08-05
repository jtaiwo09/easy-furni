import dayjs from "dayjs";

export const currencyConverter = (v: any) => {
  if (!v) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  }).format(v);
};

export const truncate = (v: string) => {
  if (!v) return "N/A";
  return v.length > 30 ? `${v.slice(0, 30)}...` : v;
};

export const formatDate = (date: Date, formatType = "MMM D, YYYY") => {
  if (!date) return "N/A";
  return dayjs(date).format(formatType);
};
