import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import productReducer from "./slices/productSlice";
import OrdersReducer from "./slices/orderSlice";
import userReducer from "./slices/userSlice";
import paymentReducer from "./slices/paymentSlice";

export const store = configureStore({
  reducer: {
    orders: OrdersReducer,
    user: userReducer,
    categories: categoryReducer,
    products: productReducer,
    payments: paymentReducer,
  },
});
