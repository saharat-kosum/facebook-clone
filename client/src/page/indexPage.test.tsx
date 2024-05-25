import { describe, it, expect } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthInitialState } from "../type";
import { renderWithProviders } from "../utils/test-utils";
import IndexPage from "./indexPage";
import { useMediaQuery } from "../utils/useMediaQuery";

vi.mock("../utils/useMediaQuery");
vi.mock("axios");

const auth: AuthInitialState = {
  mode: "Register",
  user: null,
  profile: null,
  mockIMG: "/mock",
  loading: false,
  token: "validToken",
  friends: [],
  isRegisterSuccess: false,
  isLoginSuccess: false,
  isEditSuccess: false,
};

describe("Index Page", () => {
  const renderComponent = (auth: AuthInitialState | undefined) =>
    renderWithProviders(
      <BrowserRouter>
        <IndexPage />
      </BrowserRouter>,
      {
        preloadedState: {
          auth,
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

  it("Index page render correctly", () => {
    renderComponent(auth);

    expect(screen.getByAltText(/facebook logo/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Facebook helps you connect and share with the people in your life/i
      )
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    expect(screen.getByText(/Create new account/i)).toBeInTheDocument();
  });

  it("loading display when login", async () => {
    renderComponent(auth);

    fireEvent.change(screen.getByPlaceholderText(/Email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("password"), {
      target: { value: "password123" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("should show validation errors for invalid form submission", async () => {
    renderComponent(auth);

    fireEvent.submit(screen.getByRole("button", { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please input E-mail/i)).toBeVisible();
      expect(screen.getByText(/Please input Password/i)).toBeVisible();
    });
  });

  it("should navigate to home on successful login", async () => {
    renderComponent({ ...auth, isLoginSuccess: true });

    await waitFor(() => {
      expect(window.location.pathname).toBe("/home");
    });
  });

  it("should render the toast message for registration success", () => {
    renderComponent({ ...auth, isRegisterSuccess: true });

    expect(screen.getByText(/Sign Up Success!/i)).toBeInTheDocument();
  });

  it("should render the toast message for registration failure", () => {
    renderComponent({ ...auth, isRegisterSuccess: false });

    expect(screen.getByText(/Sign Up Failed!/i)).toBeInTheDocument();
  });
});
