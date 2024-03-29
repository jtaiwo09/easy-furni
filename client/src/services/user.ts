import { baseUrl, userConfig } from "@/server";

const getUserApi = async () => {
  try {
    const res = await fetch(`${baseUrl}/user/get-user`, userConfig);
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
      ...userConfig,
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
      ...userConfig,
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
      ...userConfig,
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
      ...userConfig,
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
      ...userConfig,
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
      ...userConfig,
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
