import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchShoes = createAsyncThunk("class/fetchShoes", async () => {
  const res = await axios.get("http://localhost:3000/shoes");
  return res.data;
});
const shoesSlice = createSlice({
  name: "Shoes",
  initialState: {
    isLoading: false,
    Shoes: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchShoes.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchShoes.fulfilled, (state, action) => {
      state.isLoading = false;
      state.Shoes = action.payload;
      state.error = null;
    });
    builder.addCase(fetchShoes.rejected, (state, action) => {
      state.isLoading = false;
      state.Shoes = [];
      state.error = action.error.message;
    });
  },
});

export default shoesSlice.reducer;
