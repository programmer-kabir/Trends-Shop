import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async () => {
    try {
      const response = await axios.get("http://localhost:3000/reviews");
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
