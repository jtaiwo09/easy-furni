import Cookies from "universal-cookie";

const cookies = new Cookies();

const userToken = cookies.get("token");

export const userConfig = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  },
};

// const baseUrl = "http://localhost:8000/api/v1";
const baseUrl = "https://jtk-store-api-v1.vercel.app/api/v1";

export { baseUrl };
