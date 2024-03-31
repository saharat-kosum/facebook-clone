import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthInitialState, UserType } from "../type";
import axios from "axios";

const initialState: AuthInitialState = {
  mode: "light",
  loading: false,
  user: null,
  profile: null,
  friends: [],
  token: sessionStorage.getItem("userToken"),
  mockIMG:
    "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?w=826&t=st=1693129793~exp=1693130393~hmac=7346bd884e9145dfe06641270fd59554806208016d3acec6f42b5aebba8c28f7",
};

export const getUserDetail = createAsyncThunk(
  "authSlice/fetchUser",
  async () => {
    const { data } = await axios.get(`/users`);
    return data;
  }
);

export const getProfile = createAsyncThunk(
  "authSlice/fetchProfile",
  async (userId: string) => {
    const { data } = await axios.get(`/users/friend/${userId}`);
    return data;
  }
);

export const getFriends = createAsyncThunk(
  "authSlice/fetchFriends",
  async (userId: string) => {
    const { data } = await axios.get(`/users/${userId}/friends`);
    return data;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogIn: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setLogOut: (state) => {
      state.user = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getFriends.fulfilled, (state, action) => {
        state.friends = action.payload;
        state.loading = false;
      })
      .addMatcher(
        (action) =>
          action.type.endsWith("/pending") && action.type.includes("authSlice"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") &&
          action.type.includes("authSlice"),
        (state, action) => {
          state.loading = false;
          console.error(action.error.message);
        }
      );
  },
});

export const { setMode, setLogIn, setLogOut, setLoading, setToken } =
  authSlice.actions;
export default authSlice.reducer;
