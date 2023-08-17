import { baseUrl } from "@/server";

const getUserApi = async () => {
  try {
    const res = await fetch(`${baseUrl}/user/get-user`, {
      credentials: "include",
    });
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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  } catch (error) {
    console.log("There was an error", error);
    return error;
  }
};

export {
  getUserApi,
  updateUserInformationApi,
  updateUserPasswordApi,
  updatUserAddressApi,
  updateDefaultAddressApi,
  editUserAddressApi,
  deleteUserAddressApi,
};
