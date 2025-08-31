import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
// import useAuth from "../../../Components/Hooks/useAuth";
// import { useContext } from "react";
// import { AuthContext } from "../../../Provider/AuthProvider";
// const {user} = useContext(AuthContext)
export const fetchBooked = createAsyncThunk(
  "book/fetchBooked",
  async (userEmail) => {
    try {
      // Send userEmail in the API request
      const response = await axios.get(
        `https://tendsserver.vercel.app/booked?email=${userEmail}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const bookedSlice = createSlice({
  name: "Booked",
  initialState: {
    isLoading: false,
    Booked: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBooked.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchBooked.fulfilled, (state, action) => {
      state.isLoading = false;
      state.Booked = action.payload;
    });
    builder.addCase(fetchBooked.rejected, (state, action) => {
      state.isLoading = false;
      state.Booked = [];
      state.error = action.error.message;
    });
  },
});

export default bookedSlice.reducer;
