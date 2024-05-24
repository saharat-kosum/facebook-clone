import { describe, it, expect } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import {
  AuthInitialState,
  PostInitialState,
  PostType,
  UserType,
} from "../type";
import { renderWithProviders } from "../utils/test-utils";
import HomePage from "./HomePage";
import { useMediaQuery } from "../utils/useMediaQuery";

vi.mock("../utils/useMediaQuery");

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
  profile: null,
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

describe("Homepage", () => {
  const renderComponent = (
    auth: AuthInitialState | undefined,
    post: PostInitialState | undefined
  ) =>
    renderWithProviders(
      <BrowserRouter>
        <HomePage />
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

  it("Home page render correcly", () => {
    renderComponent(auth, postIniState);

    expect(screen.getByText("Hello World1")).toBeInTheDocument();
  });

  it("shows loading spinner when loading", () => {
    const loadingAuth = { ...auth, loading: true };
    renderComponent(loadingAuth, postIniState);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders sidebar and contact components based on media query", () => {
    renderComponent(auth, postIniState);

    expect(screen.getByText("Birthdays")).toBeInTheDocument();
    expect(screen.getByText("Suggestions")).toBeInTheDocument();
    expect(screen.getByText("Contacts")).toBeInTheDocument();
  });

  it("redirects to home page if no token", () => {
    const noTokenAuth = { ...auth, token: "" };
    renderComponent(noTokenAuth, undefined);

    expect(window.location.pathname).toBe("/");
  });

  it("renders no posts message if there are no posts", () => {
    const emptyPostIniState = { ...postIniState, posts: [] };
    renderComponent(auth, emptyPostIniState);

    expect(screen.getByText(/No post yet/i)).toBeInTheDocument();
  });
});
