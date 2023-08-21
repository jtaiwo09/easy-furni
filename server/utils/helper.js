const currencyConverter = (v) => {
  if (!v) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
  }).format(v);
};

module.exports = { currencyConverter };
