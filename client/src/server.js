const baseUrl = "http://localhost:8000/api/v1";
// const baseUrl = "https://jtk-store-api-v1.vercel.app/api/v1";

const config = {
  headers: {
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
  },
};

export { baseUrl, config };
