const cookies = new Cookies();

const userToken = cookies.get("token");
const sellerToken = cookies.get("seller_token");

export const userConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
  },
};

export const sellerConfig = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${sellerToken}`,
  },
};

// const baseUrl = "http://localhost:8000/api/v1";
const baseUrl = "https://jtk-store-api-v1.vercel.app/api/v1";

export { baseUrl };
