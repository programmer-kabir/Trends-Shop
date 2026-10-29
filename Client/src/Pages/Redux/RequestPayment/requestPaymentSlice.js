import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchRequestPayment = createAsyncThunk(
  "requestPayments/fetchRequestPayment",
  async (email) => {
    try {
      const apiBase = import.meta.env.VITE_LOCALHOST_KEY || "http://localhost:5000";
      const url = email
        ? `${apiBase}/requestPayment?email=${encodeURIComponent(email)}`
        : `${apiBase}/requestPayment`;
      const response = await axios.get(url);
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
