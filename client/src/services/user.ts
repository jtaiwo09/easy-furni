"use client";
import { baseUrl, userData } from "@/server";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const token = cookies.get("token");

export const fetchConfig = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
};

const getUserApi = async () => {
  try {
    const res = await fetch(`${baseUrl}/user/get-user`, fetchConfig);
    return res;
  } catch (error) {
    console.log("There was an error", error);
    return error;
  }
};

const updateUserInformationApi = async (data: any) => {
  try {
    const res = await fetch(`${baseUrl}/user/update-user-info`, {
      method: "PUT",
      ...fetchConfig,
      body: JSON.stringify(data),
    });
    return res;
  } catch (error) {
    console.log("There was an error", error);
    return error;
  }
};

const updateUserPasswordApi = async (data: any) => {
  try {
    const res = await fetch(`${baseUrl}/user/update-user-password`, {
      method: "PUT",
      ...fetchConfig,
      body: JSON.stringify(data),
    });
    return res;
  } catch (error) {
    console.log("There was an error", error);
    return error;
  }
};

const updatUserAddressApi = async (data: any) => {
  try {
    const res = await fetch(`${baseUrl}/user/update-user-addresses`, {
      method: "PUT",
      ...fetchConfig,
      body: JSON.stringify(data),
    });
    return res;
  } catch (error) {
    console.log("There was an error", error);
    return error;
  }
};

const updateDefaultAddressApi = async (data: string) => {
  try {
    const res = await fetch(`${baseUrl}/user/update-default-address/${data}`, {
      method: "PUT",
      ...fetchConfig,
    });
    return res;
  } catch (error) {
    console.log("There was an error", error);
    return error;
  }
};

const editUserAddressApi = async (data: any) => {
  try {
    const res = await fetch(`${baseUrl}/user/edit-user-address`, {
      method: "PUT",
      ...fetchConfig,
      body: JSON.stringify(data),
    });
    return res;
  } catch (error) {
    console.log("There was an error", error);
    return error;
  }
};

const deleteUserAddressApi = async (data: string) => {
  try {
    const res = await fetch(`${baseUrl}/user/delete-user-address/${data}`, {
      method: "DELETE",
      ...fetchConfig,
    });
    return res;
  } catch (error) {
    console.log("There was an error", error);
    return error;
  }
};

const requestPasswordResetApi = async (data: any) => {
  const res = await fetch(`${baseUrl}/user/request-reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};

const resetPasswordApi = async (data: any) => {
  const res = await fetch(`${baseUrl}/user/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (res.ok) {
    return result;
  }
  throw new Error(result.message);
};

export {
  getUserApi,
  updateUserInformationApi,
  updateUserPasswordApi,
  updatUserAddressApi,
  updateDefaultAddressApi,
  editUserAddressApi,
  deleteUserAddressApi,
  requestPasswordResetApi,
  resetPasswordApi,
};
