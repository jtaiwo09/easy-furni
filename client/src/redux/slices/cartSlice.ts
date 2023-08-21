"use client";
import { createSlice } from "@reduxjs/toolkit";

export interface CartState {
  loading: boolean;
  error: any;
  cart: Product[];
}

const initialState: CartState = {
  loading: false,
  error: null,
  cart: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems") ?? "")
    : [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const isItemExist = state.cart.find((i) => i._id === item._id);
      if (isItemExist) {
        state.cart = state.cart.map((i) =>
          i._id === isItemExist._id ? item : i
        );
      } else {
        state.cart.push(item);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((i) => i._id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
