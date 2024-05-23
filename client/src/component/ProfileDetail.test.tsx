import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthInitialState, UserType } from "../type";
import { renderWithProviders } from "../utils/test-utils";
import ProfileDetail from "./ProfileDetail";

const user: UserType = {
  _id: "userId1",
  dateOfBirth: "1622527200",
  firstName: "first",
  lastName: "last",
  email: "user@example.com",
  password: "password123",
  location: "Somewhere",
  occupation: "Developer",
  picturePath: "/picture",
  createdAt: new Date("2022-01-01T00:00:00Z"),
  updatedAt: new Date("2023-01-01T00:00:00Z"),
  friends: ["friendId1", "friendId2"],
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

describe("Profile Detail", () => {
  const renderComponent = (auth: AuthInitialState | undefined) =>
    renderWithProviders(
      <BrowserRouter>
        <ProfileDetail props={user} />
      </BrowserRouter>,
      {
        preloadedState: {
          auth,
        },
      }
    );

  it("renders profile detail correctly", () => {
    renderComponent(auth);

    const profilePicture = screen.getByAltText("Profile");
    expect(profilePicture).toHaveAttribute(
      "src",
      `${process.env.REACT_APP_PREFIX_URL_IMG}${user.picturePath}`
    );

    const fullName = screen.getByText(`${user.firstName} ${user.lastName}`);
    expect(fullName).toBeInTheDocument();

    const occupation = screen.getByText(user.occupation);
    expect(occupation).toBeInTheDocument();

    const joinedDate = screen.getByText(/Joined on/i);
    expect(joinedDate).toBeInTheDocument();

    const location = screen.getByText(user.location);
    expect(location).toBeInTheDocument();

    const email = screen.getByText(user.email);
    expect(email).toBeInTheDocument();

    const dateOfBirth = screen.getByText(/01 Jun 2021/);
    expect(dateOfBirth).toBeInTheDocument();
  });

  it("shows edit profile button for the correct user", () => {
    renderComponent(auth);

    const editProfileButton = screen.getByText(/Edit Profile/i);
    expect(editProfileButton).toBeVisible();
  });

  it("does not show edit profile button for a different user", () => {
    if (!auth.user) {
      throw new Error("auth.user is null or undefined");
    }
    const differentAuth = {
      ...auth,
      user: {
        ...auth.user,
        _id: "userId4",
      },
    };

    renderComponent(differentAuth);

    const editProfileButton = screen.queryByText(/Edit Profile/i);
    expect(editProfileButton).toHaveClass("invisible");
  });
});
