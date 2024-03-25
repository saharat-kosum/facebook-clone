import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CommentType, PostInitialState, PostType } from "../type";
import axios from "axios";

const initialState: PostInitialState = {
  posts: [],
  loading: false,
};

export const getFeedPost = createAsyncThunk(
  "postSlice/fetchFeedPost",
  async () => {
    const { data } = await axios.get(`/posts`);
    return data;
  }
);

export const likePostThunk = createAsyncThunk(
  "postSlice/likePost",
  async ({ id, userId }: { id: string; userId: string }) => {
    const response = await axios.put(`/posts/${id}/like`, {
      userId,
    });
    const data: PostType = response.data;
    return data;
  }
);

export const commentPostThunk = createAsyncThunk(
  "postSlice/commentPost",
  async ({ id, newComment }: { id: string; newComment: CommentType }) => {
    const response = await axios.post(`/posts/add/comment/${id}`, newComment);
    const data: PostType = response.data;
    return data;
  }
);

export const deletePostThunk = createAsyncThunk(
  "postSlice/deletePost",
  async (id: string) => {
    const response = await axios.delete(`/posts/delete/${id}`);
    return id;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedPost.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(likePostThunk.fulfilled, (state, action) => {
        const updatedPosts = state.posts.map((post) => {
          if (post._id === action.payload._id) {
            return action.payload;
          }
          return post;
        });
        state.posts = updatedPosts;
        state.loading = false;
      })
      .addCase(commentPostThunk.fulfilled, (state, action) => {
        const updatedPosts = state.posts.map((post) => {
          if (post._id === action.payload._id) {
            return action.payload;
          }
          return post;
        });
        state.posts = updatedPosts;
        state.loading = false;
      })
      .addCase(deletePostThunk.fulfilled, (state, action) => {
        const filter = state.posts.filter(
          (post) => post._id !== action.payload
        );
        state.posts = filter;
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
