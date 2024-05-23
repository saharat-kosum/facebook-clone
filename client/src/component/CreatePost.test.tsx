import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthInitialState } from "../type";
import { renderWithProviders } from "../utils/test-utils";
import CreatePost from "./CreatePost";
import { useMediaQuery } from "../utils/useMediaQuery";

vi.mock("../utils/useMediaQuery");
vi.stubEnv("REACT_APP_PREFIX_URL_IMG", "");

const user = {
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
  token: "null",
  friends: [],
  isRegisterSuccess: false,
  isLoginSuccess: false,
  isEditSuccess: false,
};

describe("Create Post Component", () => {
  const renderComponent = (auth: AuthInitialState | undefined) =>
    renderWithProviders(
      <BrowserRouter>
        <CreatePost />
      </BrowserRouter>,
      {
        preloadedState: {
          auth,
        },
      }
    );

  it("render Post Component correctly", () => {
    renderComponent(auth);

    const profileImage = screen.getByAltText("profile");
    expect(profileImage).toBeInTheDocument();

    const href = profileImage.getAttribute("src");
    expect(href).toBe("/picture");
    expect(
      screen.getByPlaceholderText("What's on your mind ?")
    ).toBeInTheDocument();
  });

  it("render mock profile image", () => {
    const modifiedAuth = { ...auth, user: { ...user, picturePath: "" } };
    renderComponent(modifiedAuth);

    const profileImage = screen.getByAltText("profile");
    expect(profileImage).toBeInTheDocument();

    const href = profileImage.getAttribute("src");
    expect(href).toBe("/mock");
  });

  it("displays buttons correctly when screen size is mobile", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    renderComponent(auth);

    expect(screen.getByText("Live video")).toBeInTheDocument();
    expect(screen.getByText("Photo/Video")).toBeInTheDocument();
    expect(screen.getByText("Feeling/Activity")).toBeInTheDocument();
  });

  it("does not display text labels for buttons when screen size is not mobile", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    renderComponent(auth);

    expect(screen.queryByText("Live video")).not.toBeInTheDocument();
    expect(screen.queryByText("Photo/Video")).not.toBeInTheDocument();
    expect(screen.queryByText("Feeling/Activity")).not.toBeInTheDocument();
  });
});
