import { configureStore } from "@reduxjs/toolkit";
import shoesSlice from "./Shoes/shoesSlice";
import userSlice from "./Users/userSlice";
import couponSlice from "./Coupons/couponsSlice";
import bookedSlice from "./Booked/bookedSlice";

const store = configureStore({
  reducer: {
    Shoes: shoesSlice,
    Users: userSlice,
    Coupons: couponSlice,
    Booked:bookedSlice
  },
});
export default store;
