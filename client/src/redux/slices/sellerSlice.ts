import { SellerLoginFormData } from "@/app/(auth)/shop-login/page";
import { loginSeller, logoutSeller } from "@/services/auth";
import {
  deleteSellerAdminApi,
  getAllSellerAdminApi,
  getSellerApi,
} from "@/services/seller";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface SellerState {
  loading: boolean;
  success: boolean;
  error: any;
  isSeller: boolean;
  seller: any;
}

const initialState: SellerState = {
  loading: false,
  success: false,
  error: null,
  isSeller: false,
  seller: null,
};

export const login = createAsyncThunk(
  "seller/login",
  async (data: SellerLoginFormData, thunkApi) => {
    const response = (await loginSeller(data)) as any;
    if (!response.ok) {
      return thunkApi.rejectWithValue(await response.json());
    }
    return await response.json();
  }
);

export const logout = createAsyncThunk("seller/logout", async (_, thunkApi) => {
  const response = (await logoutSeller()) as any;
  if (!response.ok) {
    return thunkApi.rejectWithValue(await response.json());
  }
  return await response.json();
});

export const getSeller = createAsyncThunk(
  "seller/get-seller",
  async (_, thunkApi) => {
    const response = (await getSellerApi()) as any;
    if (!response.ok) {
      return thunkApi.rejectWithValue(await response.json());
    }
    return await response.json();
  }
);

export const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    updateSeller: (state, { payload }) => {
      state.seller = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.seller = action.payload.seller;
        state.isSeller = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.seller = null;
        state.isSeller = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSeller.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.seller = action.payload.seller;
      })
      .addCase(getSeller.rejected, (state, action) => {
        state.loading = false;
        state.seller = null;
        state.error = action.payload;
      });
  },
});

export const { updateSeller } = sellerSlice.actions;
export default sellerSlice.reducer;
