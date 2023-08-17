import dayjs from "dayjs";

export const currencyConverter = (v: any) => {
  if (!v) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  }).format(v);
};

export const truncate = (v: string, num = 30) => {
  if (!v) return "N/A";
  return v.length > num ? `${v.slice(0, num)}...` : v;
};

export const formatDate = (date: Date | any, formatType = "MMM D, YYYY") => {
  if (!date) return "N/A";
  return dayjs(date).format(formatType);
};
