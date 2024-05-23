import { describe, it, expect, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthInitialState } from "../type";
import { renderWithProviders } from "../utils/test-utils";
import NavBar from "./NavBar";
import { useMediaQuery } from "../utils/useMediaQuery";
import * as authSlice from "../redux/authSlice";
import axios from "axios";

vi.mock("../utils/useMediaQuery");
vi.mock("axios");
const axiosGet = vi.fn();

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

describe("Navbar Component", () => {
  const renderComponent = (auth: AuthInitialState | undefined) =>
    renderWithProviders(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>,
      {
        preloadedState: {
          auth,
        },
      }
    );

  it("Navbar render correctly", () => {
    renderComponent(auth);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders the search input when screen width is above 570px", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    renderComponent(auth);
    expect(screen.getByPlaceholderText("Search ...")).toBeInTheDocument();
  });

  it("does not render the search input when screen width is below 570px", () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    renderComponent(auth);
    expect(screen.queryByPlaceholderText("Search ...")).not.toBeInTheDocument();
  });

  it("navigates to profile page on profile click", async () => {
    renderComponent(auth);
    fireEvent.click(screen.getByText("Profile"));
    expect(window.location.pathname).toBe("/profile/userId1");
  });

  it("logs out the user on log out click", () => {
    renderComponent(auth);
    const spy = vi.spyOn(authSlice, "setLogOut");
    fireEvent.click(screen.getByText("Log Out"));
    expect(spy).toHaveBeenCalled();
  });

  it("handles search input correctly", async () => {
    axios.get = axiosGet;
    axiosGet.mockResolvedValueOnce({
      data: { users: [user] },
    });
    (useMediaQuery as jest.Mock).mockReturnValue(true);

    renderComponent(auth);
    const searchInput = screen.getByPlaceholderText("Search ...");
    fireEvent.change(searchInput, { target: { value: "test" } });

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith("/users/search?search=test")
    );
    expect(screen.getByText("first last")).toBeInTheDocument();

    fireEvent.blur(searchInput);
    expect(screen.queryByText("first last")).not.toBeInTheDocument();
  });
});
