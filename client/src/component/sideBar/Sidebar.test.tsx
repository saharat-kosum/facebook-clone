import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../utils/test-utils";
import { BrowserRouter } from "react-router-dom";
import { AuthInitialState } from "../../type";
import SideBar, { sideBarArray } from "./SideBar";

vi.stubEnv("REACT_APP_PREFIX_URL_IMG", "");

const user = {
  _id: "user1",
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

describe("Sidebar Component", () => {
  const renderComponent = (auth: AuthInitialState | undefined) =>
    renderWithProviders(
      <BrowserRouter>
        <SideBar />
      </BrowserRouter>,
      {
        preloadedState: {
          auth,
        },
      }
    );

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sidebar render correctly", () => {
    renderComponent(auth);

    const sidebar = screen.getByRole("list");
    expect(sidebar).toBeInTheDocument();

    const profileImage = screen.getByAltText("profile");
    expect(profileImage).toBeInTheDocument();

    const href = profileImage.getAttribute("src");
    expect(href).toBe("/picture");

    const userName = screen.getByText(`first last`);
    expect(userName).toBeInTheDocument();
  });

  it("render mock profile image", () => {
    if (!auth.user) {
      throw new Error("auth.user is null or undefined");
    }

    auth.user.picturePath = "";
    renderComponent(auth);

    const profileImage = screen.getByAltText("profile");
    expect(profileImage).toBeInTheDocument();

    const href = profileImage.getAttribute("src");
    expect(href).toBe("/mock");
  });

  it("should display sidebar items", () => {
    renderComponent(auth);
    sideBarArray.forEach((item) => {
      const sidebarItem = screen.getByText(item.display);
      expect(sidebarItem).toBeInTheDocument();
      expect(sidebarItem.firstChild).toHaveClass(`bi ${item.icon}`);
    });
  });

  it("should navigate to the profile page on clicking the profile", async () => {
    renderComponent(auth);

    const profileItem = screen.getByText(`first last`);
    fireEvent.click(profileItem);

    await waitFor(() => {
      expect(window.location.pathname).toBe(`/profile/${user._id}`);
    });
  });
});
