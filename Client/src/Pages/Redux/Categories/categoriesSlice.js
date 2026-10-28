import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_LOCALHOST_KEY || "http://localhost:5000";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    try {
      const response = await axios.get(`${API_BASE}/categories`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("fetchCategories error:", error);
      throw error;
    }
  }
);

const categoriesSlice = createSlice({
  name: "Categories",
  initialState: {
    isLoading: false,
    Categories: [],
    error: null,
  },
  reducers: {
    setLocalCategories: (state, action) => {
      state.Categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.Categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const { setLocalCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
