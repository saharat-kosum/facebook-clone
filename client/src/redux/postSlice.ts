import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CommentType,
  CreatePostProps,
  PostInitialState,
  PostPayload,
  PostType,
} from "../type";
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

export const getProfilePost = createAsyncThunk(
  "postSlice/fetchProfilePost",
  async (userId: string) => {
    const { data } = await axios.get(`/posts/${userId}/posts`);
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
    await axios.delete(`/posts/delete/${id}`);
    return id;
  }
);

export const createPost = createAsyncThunk(
  "postSlice/createPost",
  async ({ userId, description, uploadedFile }: CreatePostProps) => {
    const payload: PostPayload = {
      userId,
      description,
    };
    const formData = new FormData();
    if (uploadedFile) {
      formData.append("file", uploadedFile);
    }
    formData.append("postData", JSON.stringify(payload));
    const response = await axios.post(`/posts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data: PostType = response.data;
    return data;
  }
);

export const editPost = createAsyncThunk(
  "postSlice/editPost",
  async (post: PostType) => {
    const response = await axios.put(`/posts/${post._id}`, { post });
    const data: PostType = response.data;
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
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(getProfilePost.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(likePostThunk.fulfilled, (state, action) => {
        const updatedPosts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
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
      .addCase(editPost.fulfilled, (state, action) => {
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
      .addCase(createPost.fulfilled, (state, action) => {
        const newPost = [action.payload, ...state.posts];
        state.posts = newPost;
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
