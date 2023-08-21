import dayjs from "dayjs";

export const currencyConverter = (v: any) => {
  if (!v) return "N/A";
  return v.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: Math.ceil(v % 1) * 2,
  });
};

export const truncate = (v: string, num = 30) => {
  if (!v) return "N/A";
  return v.length > num ? `${v.slice(0, num)}...` : v;
};

export const formatDate = (date: Date | any, formatType = "MMM D, YYYY") => {
  if (!date) return "N/A";
  return dayjs(date).format(formatType);
};
