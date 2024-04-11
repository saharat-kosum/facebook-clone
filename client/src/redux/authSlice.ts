import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AuthInitialState, UserType, RegisterProps } from "../type";
import axios from "axios";

const initialState: AuthInitialState = {
  mode: "light",
  loading: false,
  isLoginSuccess: false,
  isRegisterSuccess: false,
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

export const loginHandle = createAsyncThunk(
  "authSlice/loginHandle",
  async (user: { email: string; password: string }) => {
    const { data } = await axios.post(`/auth/login`, user);
    sessionStorage.setItem("userToken", data.token);
    return data;
  }
);

export const registerHandle = createAsyncThunk(
  "authSlice/registerHandle",
  async ({ user, uploadedFile }: RegisterProps) => {
    const formData = new FormData();
    if (uploadedFile) {
      formData.append("file", uploadedFile);
    }
    formData.append("userData", JSON.stringify(user));
    const { data } = await axios.post(`/auth/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
      .addCase(loginHandle.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoginSuccess = true;
        state.loading = false;
      })
      .addCase(loginHandle.rejected, (state) => {
        state.isLoginSuccess = false;
      })
      .addCase(registerHandle.fulfilled, (state) => {
        state.isRegisterSuccess = true;
        state.loading = false;
      })
      .addCase(registerHandle.rejected, (state) => {
        state.isRegisterSuccess = false;
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
