import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchRequestPayment = createAsyncThunk(
  "requestPayments/fetchRequestPayment",
  async () => {
    try {
      const apiBase = import.meta.env.VITE_LOCALHOST_KEY || "http://localhost:5000";
      const response = await axios.get(
        `${apiBase}/requestPayment`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const requestPaymentSlice = createSlice({
  name: "RequestPayment",
  initialState: {
    isLoading: false,
    RequestPayment: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRequestPayment.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchRequestPayment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.RequestPayment = action.payload;
    });
    builder.addCase(fetchRequestPayment.rejected, (state, action) => {
      state.isLoading = false;
      state.RequestPayment = [];
      state.error = action.error.message;
    });
  },
});

export default requestPaymentSlice.reducer;
