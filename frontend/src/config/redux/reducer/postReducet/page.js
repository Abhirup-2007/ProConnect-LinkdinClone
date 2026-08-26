import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts, getAllCommnet } from "../../action/postAction/page.js";

const initialState = {
  posts: [],
  isError: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  postsFetched: false,
  comments: [],
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: (state) => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "...Fetching all  post ";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.posts.reverse();
        state.postsFetched = true;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAllCommnet.fulfilled, (state, action) => {
        state.postId = action.payload.post_id;
        state.comments = action.payload.comments;
      })
  },
});

export const {reset,resetPostId} = postSlice.actions

export default postSlice.reducer;
