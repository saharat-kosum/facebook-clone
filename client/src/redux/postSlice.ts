import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PostInitialState } from "../type";
import axios from "axios";

const initialState: PostInitialState = {
  post: [],
  loading: false,
};

export const getFeedPost = createAsyncThunk(
  "postSlice/fetchFeedPost",
  async () => {
    const { data } = await axios.get(`/posts`);
    return data;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedPost.fulfilled, (state, action) => {
        state.post = action.payload;
        state.loading = false;
      })
      .addMatcher(
        (action) =>
          action.type.endsWith("/pending") && action.type.includes("postSlice"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") &&
          action.type.includes("postSlice"),
        (state, action) => {
          state.loading = false;
          console.error(action.error.message);
        }
      );
  },
});

export default postSlice.reducer;
