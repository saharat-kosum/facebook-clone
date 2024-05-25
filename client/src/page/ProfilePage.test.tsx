import { describe, it, expect } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AuthInitialState,
  PostInitialState,
  PostType,
  UserType,
} from "../type";
import { renderWithProviders } from "../utils/test-utils";
import ProfilePage from "./ProfilePage";
import { useMediaQuery } from "../utils/useMediaQuery";
import axios from "axios";

vi.mock("../utils/useMediaQuery");
vi.mock("axios");

const user: UserType = {
  _id: "userId1",
  dateOfBirth: "",
  firstName: "first",
  lastName: "last",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picturePath: "/picture",
};

const auth: AuthInitialState = {
  mode: "Register",
  user: user,
  profile: user,
  mockIMG: "/mock",
  loading: false,
  token: "validToken",
  friends: [],
  isRegisterSuccess: false,
  isLoginSuccess: false,
  isEditSuccess: false,
};

const post: PostType = {
  userId: "id123",
  firstName: "PostName",
  lastName: "PostLast",
  description: "Hello World1",
};

const postIniState: PostInitialState = {
  posts: [post],
  loading: false,
};

describe("Profile page", () => {
  const renderComponent = (
    auth: AuthInitialState | undefined,
    post: PostInitialState | undefined
  ) =>
    renderWithProviders(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>,
      {
        preloadedState: {
          auth,
          post,
        },
      }
    );

  beforeEach(() => {
    (useMediaQuery as jest.Mock).mockImplementation((query) => {
      if (query === "(min-width: 1024px)") return true;
      if (query === "(min-width: 768px)") return true;
      if (query === "(min-width: 425px)") return true;
      return false;
    });
  });

  it("Profile page render correctly", () => {
    const noPost = { ...postIniState, posts: [] };
    renderComponent(auth, noPost);
    expect(screen.getByText(/No post yet/i)).toBeInTheDocument();
  });

  it("redirects to home if no token", () => {
    const noTokenAuth = { ...auth, token: "" };

    renderComponent(noTokenAuth, postIniState);
    waitFor(() => expect(window.location.replace).toHaveBeenCalledWith("/"));
  });

  it("shows loading indicator when loading", () => {
    const loadingAuth = { ...auth, loading: true };
    renderComponent(loadingAuth, postIniState);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders profile details when profile is loaded", () => {
    renderComponent(auth, postIniState);
    expect(screen.getByText("first last")).toBeInTheDocument();
  });

  it("renders posts when posts are loaded", async () => {
    renderComponent(auth, postIniState);
    await waitFor(() => {
      expect(screen.getByText("Hello World1")).toBeInTheDocument();
    });
  });
});
