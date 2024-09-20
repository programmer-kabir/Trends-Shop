import { configureStore } from "@reduxjs/toolkit";
import shoesSlice from "./Shoes/shoesSlice";
import userSlice from "./Users/userSlice";

const store = configureStore({
  reducer: {
    Shoes: shoesSlice,
    Users: userSlice,
  },
});
export default store;