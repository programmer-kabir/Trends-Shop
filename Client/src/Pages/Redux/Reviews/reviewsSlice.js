import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async () => {
    try {
      const apiBase = import.meta.env.VITE_LOCALHOST_KEY || "http://localhost:5000";
      const response = await axios.get(`${apiBase}/reviews`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const reviewsSlice = createSlice({
  name: "Reviews",
  initialState: {
    isLoading: false,
    Reviews: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchReviews.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      state.isLoading = false;
      state.Reviews = action.payload;
    });
    builder.addCase(fetchReviews.rejected, (state, action) => {
      state.isLoading = false;
      state.Reviews = [];
      state.error = action.error.message;
    });
  },
});

export default reviewsSlice.reducer;
