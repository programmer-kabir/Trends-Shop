import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchCoupons = createAsyncThunk(
  "coupons/fetchCoupons",
  async () => {
    try {
      const response = await axios.get(
        "https://tendsserver.vercel.app/couponCode"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const couponsSlice = createSlice({
  name: "Coupons",
  initialState: {
    isLoading: false,
    Coupons: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCoupons.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCoupons.fulfilled, (state, action) => {
      state.isLoading = false;
      state.Coupons = action.payload;
    });
    builder.addCase(fetchCoupons.rejected, (state, action) => {
      state.isLoading = false;
      state.Coupons = [];
      state.error = action.error.message;
    });
  },
});

export default couponsSlice.reducer;
