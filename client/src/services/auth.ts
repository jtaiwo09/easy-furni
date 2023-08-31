import { baseUrl } from "@/server";

const signup = async (data: any) => {
  try {
    const res = await fetch(`${baseUrl}/user/create-user`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};

const loginUser = async (data: any) => {
  try {
    const res = await fetch(`${baseUrl}/user/login-user`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};

// Signup Seller
const signupSeller = async (data: any) => {
  try {
    const res = await fetch(`${baseUrl}/shop/create`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res;
  } catch (error) {
    return error;
  }
};

const loginSeller = async (data: any) => {
  try {
    const res = await fetch(`${baseUrl}/shop/login`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    return error;
  }
};

const logoutSeller = async () => {
  try {
    const res = await fetch(`${baseUrl}/shop/logout`, {
      credentials: "include",
    });
    return res;
  } catch (error) {
    return error;
  }
};

export { signup, loginUser, signupSeller, loginSeller, logoutSeller };
