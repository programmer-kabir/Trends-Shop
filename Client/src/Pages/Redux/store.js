import { configureStore } from "@reduxjs/toolkit";
import shoesSlice from "./Shoes/shoesSlice";
import userSlice from "./Users/userSlice";
import couponSlice from "./Coupons/couponsSlice";

const store = configureStore({
  reducer: {
    Shoes: shoesSlice,
    Users: userSlice,
    Coupons: couponSlice,
  },
});
export default store;
