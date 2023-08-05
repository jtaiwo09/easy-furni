import { createProductApi } from "@/services/product";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ProductState {
  loading: boolean;
  error: any;
  product: any;
  allProducts: any;
}

const initialState: ProductState = {
  loading: false,
  error: null,
  product: null,
  allProducts: [],
};

export const createProduct = createAsyncThunk(
  "product/create-product",
  async (data: any, thunkApi) => {
    const response = (await createProductApi(data)) as any;
    if (!response.ok) {
      return thunkApi.rejectWithValue(await response.json());
    }
    return await response.json();
  }
);

export const productSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.product = null;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
