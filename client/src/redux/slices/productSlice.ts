import { createProductApi, updateProductApi } from "@/services/product";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ProductState {
  loading: boolean;
  error: any;
  product: any;
  allProducts: any;
  showFilter: boolean;
}

const initialState: ProductState = {
  loading: false,
  error: null,
  product: null,
  allProducts: [],
  showFilter: false,
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

export const updateProduct = createAsyncThunk(
  "product/update-product",
  async (data: any, thunkApi) => {
    const response = (await updateProductApi(data)) as any;
    if (!response.ok) {
      return thunkApi.rejectWithValue(await response.json());
    }
    return await response.json();
  }
);

export const productSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    toggleFilter: (state) => {
      state.showFilter = !state.showFilter;
    },
  },
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
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { toggleFilter } = productSlice.actions;
export default productSlice.reducer;
