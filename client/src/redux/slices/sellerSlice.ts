import { SellerLoginFormData } from "@/app/(auth)/shop/login/page";
import { loginSeller } from "@/services/auth";
import { getSellerApi } from "@/services/seller";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const cookiesOption = {
  maxAge: 7 * 24 * 60 * 60,
  path: "/",
  domain:
    process.env.NODE_ENV === "development"
      ? "localhost"
      : "jtkstore.vercel.app",
};

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
        cookies.set("seller_id", action.payload.user._id, cookiesOption);
        cookies.set("seller_token", action.payload.token, cookiesOption);
        state.loading = false;
        state.error = null;
        state.seller = action.payload.seller;
        state.isSeller = true;
      })
      .addCase(login.rejected, (state, action) => {
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
