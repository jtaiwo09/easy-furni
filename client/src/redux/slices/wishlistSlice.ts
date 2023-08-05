"use client";
import { createSlice } from "@reduxjs/toolkit";

export interface SliceState {
  loading: boolean;
  error: any;
  wishlist: Product[];
}

const initialState: SliceState = {
  loading: false,
  error: null,
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems") ?? "")
    : [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;
      const isItemExist = state.wishlist.find((i) => i._id === item._id);
      if (isItemExist) {
        state.wishlist = state.wishlist.map((i) =>
          i._id === isItemExist._id ? item : i
        );
      } else {
        state.wishlist.push(item);
      }
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter((i) => i._id !== action.payload);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
