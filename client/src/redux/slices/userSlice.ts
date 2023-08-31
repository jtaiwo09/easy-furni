import { LoginFormData } from "@/app/(auth)/login/page";
import { AddressFormData } from "@/app/(main)/(dashboard)/address/page";
import { ChangePasswordFormData } from "@/app/(main)/(dashboard)/change-password/page";
import { ProfileFormData } from "@/app/(main)/(dashboard)/profile/page";
import { loginUser } from "@/services/auth";
import {
  deleteUserAddressApi,
  editUserAddressApi,
  getUserApi,
  updatUserAddressApi,
  updateDefaultAddressApi,
  updateUserInformationApi,
  updateUserPasswordApi,
} from "@/services/user";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export interface UserState {
  loading: boolean;
  error: any;
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
  isAuthenticated: false,
  user: null,
};

export const login = createAsyncThunk(
  "user/login",
  async (data: LoginFormData, thunkApi) => {
    const response = (await loginUser(data)) as any;
    if (!response.ok) {
      return thunkApi.rejectWithValue(await response.json());
    }
    return await response.json();
  }
);

export const getUser = createAsyncThunk(
  "user/get-user",
  async (_, thunkApi) => {
    const response = (await getUserApi()) as any;
    if (!response.ok) {
      return thunkApi.rejectWithValue(await response.json());
    }
    return await response.json();
  }
);

export const updateUserPassword = createAsyncThunk(
  "user/update-user-password",
  async (data: ChangePasswordFormData, thunkApi) => {
    const response = (await updateUserPasswordApi(data)) as any;
    if (!response.ok) {
      return thunkApi.rejectWithValue(await response.json());
    }
    return await response.json();
  }
);

export const updateUserInformation = createAsyncThunk(
  "user/update-user-info",
  async (data: ProfileFormData, thunkApi) => {
    const response = (await updateUserInformationApi(data)) as any;
    if (!response.ok) {
      return thunkApi.rejectWithValue(await response.json());
    }
    return await response.json();
  }
);

export const updatUserAddress = createAsyncThunk(
  "user/update-user-addresses",
  async (data: AddressFormData, thunkApi) => {
    const response = (await updatUserAddressApi(data)) as any;
    if (!response.ok) {
      return thunkApi.rejectWithValue(await response.json());
    }
    return await response.json();
  }
);

export const setDefaultAddress = createAsyncThunk(
  "user/update-default-address",
  async (data: string, thunkApi) => {
    const response = (await updateDefaultAddressApi(data)) as any;
    if (!response.ok) {
      return thunkApi.rejectWithValue(await response.json());
    }
    return await response.json();
  }
);

export const editUserAddress = createAsyncThunk(
  "user/edit-user-addresses",
  async (data: any, thunkApi) => {
    const response = (await editUserAddressApi(data)) as any;
    if (!response.ok) {
      return thunkApi.rejectWithValue(await response.json());
    }
    return await response.json();
  }
);

export const deleteUserAddress = createAsyncThunk(
  "user/delete-user-addresses",
  async (data: string, thunkApi) => {
    const response = (await deleteUserAddressApi(data)) as any;
    if (!response.ok) {
      return thunkApi.rejectWithValue(await response.json());
    }
    return await response.json();
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        cookies.set("token", action.payload.token, {
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
          domain:
            process.env.NODE_ENV === "development"
              ? "localhost"
              : ".vercel.app",
        });
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(updateUserInformation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserInformation.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(updateUserInformation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatUserAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(updatUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setDefaultAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editUserAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(editUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(editUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUserAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.user;
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
// export const { } = userSlice.actions;

export default userSlice.reducer;
