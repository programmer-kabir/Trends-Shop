import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchUser = createAsyncThunk("users/fetchUser", async () => {
  try {
    const response = await axios.get("https://tendsserver.vercel.app/users");
    return response.data;
  } catch (error) {
    throw error;
  }
});
const userSlice = createSlice({
  name: "Users",
  initialState: {
    isLoading: false,
    Users: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.Users = action.payload;
      state.error = null;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.isLoading = false;
      state.Users = [];
      state.error = action.error.message;
    });
  },
});

export default userSlice.reducer;
