import { getAllUsersOrdersApi } from "@/services/order";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface OrderState {
  loading: boolean;
  error: any;
  orders: Order[];
}

const initialState: OrderState = {
  loading: false,
  error: null,
  orders: [],
};

export const getAllUsersOrders = createAsyncThunk(
  "orders/get-user-orders",
  async (id: string, thunkApi) => {
    const response = (await getAllUsersOrdersApi(id)) as any;
    if (!response.ok) {
      return thunkApi.rejectWithValue(await response.json());
    }
    return await response.json();
  }
);

export const productSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsersOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload.orders;
      })
      .addCase(getAllUsersOrders.rejected, (state, action) => {
        state.loading = false;
        state.orders = [];
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
