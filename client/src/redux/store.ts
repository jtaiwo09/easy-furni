"use client";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import sellerReducer from "./slices/sellerSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    product: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type AppStore = ReturnType<typeof makeStore>;
// export type RootState = ReturnType<AppStore["getState"]>;
// export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
