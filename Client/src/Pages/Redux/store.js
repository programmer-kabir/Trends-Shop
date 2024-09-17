import { configureStore } from "@reduxjs/toolkit";
import shoesSlice from "./Shoes/shoesSlice";

const store = configureStore({
  reducer: {
    Shoes: shoesSlice,
  },
});
export default store;