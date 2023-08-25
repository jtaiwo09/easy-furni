import { getSession } from "next-auth/react";

// const baseUrl = "http://localhost:8000/api/v1";
const baseUrl = "https://jtk-store-api-v1.vercel.app/api/v1";

export async function userData() {
  const session = await getSession();
  return session?.user;
}

export { baseUrl };
