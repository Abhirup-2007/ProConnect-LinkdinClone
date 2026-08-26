import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  login,
  register,
  getAllUsers,
  getMyAllConnection,
  getConnectionRequrest,
  sendConnectionRequest
} from "../../action/authAction/page";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  isTokenThere: false,
  message: "",
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_Users: [],
  all_profile_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => initialState,
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.message = "...Login user";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.loggedIn = true;
        state.message = "Login successful";
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Login failed";
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
        state.message = "Registration successful";
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profileFetched = true;
        state.user = action.payload.profile;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profile_fetched = true;
        state.all_Users = action.payload.allProfile;
      })
      .addCase(getConnectionRequrest.fulfilled, (state, action) => {
        state.connections = action.payload.connections;
      })
      .addCase(getConnectionRequrest.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyAllConnection.fulfilled, (state, action) => {
        state.connectionRequest = action.payload.connections;
      })
      .addCase(getMyAllConnection.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.message = action.payload?.message;
      });
  },
});

export const { reset, setTokenIsNotThere, setTokenIsThere } = authSlice.actions;
export default authSlice.reducer;
