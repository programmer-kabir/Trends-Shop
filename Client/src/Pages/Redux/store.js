import { configureStore } from "@reduxjs/toolkit";
import shoesSlice from "./Shoes/shoesSlice";
import userSlice from "./Users/userSlice";
import couponSlice from "./Coupons/couponsSlice";
import bookedSlice from "./Booked/bookedSlice";
import requestPaymentSlice from "./RequestPayment/requestPaymentSlice";
import reviewsSlice from "./Reviews/reviewsSlice";

const store = configureStore({
  reducer: {
    Shoes: shoesSlice,
    Users: userSlice,
    Coupons: couponSlice,
    Booked:bookedSlice,
    RequestPayment:requestPaymentSlice,
    Reviews:reviewsSlice
  },
});
export default store;
