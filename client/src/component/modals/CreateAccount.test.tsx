import { describe, it, expect } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import CreateAccount from "./CreateAccount";
import { BrowserRouter } from "react-router-dom";
import { renderWithProviders } from "../../utils/test-utils";
import { AuthInitialState } from "../../type";
import axios from "axios";

vi.mock("axios");

describe("Create Account Component", () => {
  const renderComponent = (auth: AuthInitialState | undefined) =>
    renderWithProviders(
      <BrowserRouter>
        <CreateAccount />
      </BrowserRouter>,
      {
        preloadedState: {
          auth,
        },
      }
    );

  it("renders the component correctly (Sign Up)", () => {
    const store: AuthInitialState = {
      mode: "Register",
      user: null,
      profile: null,
      mockIMG: "",
      loading: false,
      token: "null",
      friends: [],
      isRegisterSuccess: false,
      isLoginSuccess: false,
      isEditSuccess: false,
    };
    renderComponent(store);
    expect(screen.getAllByText("Sign Up")).toHaveLength(2);
  });

  it("renders input fields correctly", () => {
    renderComponent(undefined);
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Surname")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Birthday")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Location")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Occupation")).toBeInTheDocument();
  });

  it("validates form inputs", async () => {
    renderComponent(undefined);
    const submitButton = screen.getAllByText("Sign Up");

    fireEvent.click(submitButton[1]);

    await waitFor(() => {
      expect(screen.getAllByText(/is required/i)).toHaveLength(7);
    });
  });

  it("handles input changes correctly", () => {
    renderComponent(undefined);

    const firstNameInput = screen.getByPlaceholderText(
      "First Name"
    ) as HTMLInputElement;
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    expect(firstNameInput.value).toBe("John");

    const lastNameInput = screen.getByPlaceholderText(
      "Surname"
    ) as HTMLInputElement;
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    expect(lastNameInput.value).toBe("Doe");

    const emailInput = screen.getByPlaceholderText(
      "E-mail"
    ) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    expect(emailInput.value).toBe("john.doe@example.com");

    const passwordInput = screen.getByPlaceholderText(
      "Password"
    ) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput.value).toBe("password123");

    const birthdayInput = screen.getByPlaceholderText(
      "Birthday"
    ) as HTMLInputElement;
    fireEvent.change(birthdayInput, { target: { value: "1990-01-01" } });
    expect(birthdayInput.value).toBe("1990-01-01");

    const locationInput = screen.getByPlaceholderText(
      "Location"
    ) as HTMLInputElement;
    fireEvent.change(locationInput, { target: { value: "New York" } });
    expect(locationInput.value).toBe("New York");

    const occupationInput = screen.getByPlaceholderText(
      "Occupation"
    ) as HTMLInputElement;
    fireEvent.change(occupationInput, { target: { value: "Developer" } });
    expect(occupationInput.value).toBe("Developer");
  });

  it("dispatches registerHandle action on form submit", async () => {
    renderComponent(undefined);

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Surname"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("E-mail"), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Birthday"), {
      target: { value: "1990-01-01" },
    });
    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "New York" },
    });
    fireEvent.change(screen.getByPlaceholderText("Occupation"), {
      target: { value: "Developer" },
    });

    fireEvent.submit(screen.getByRole("form", { hidden: true }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it("shows loading spinner when isLoading is true", () => {
    const store: AuthInitialState = {
      mode: "",
      user: null,
      profile: null,
      mockIMG: "",
      loading: true,
      token: "null",
      friends: [],
      isRegisterSuccess: true,
      isLoginSuccess: true,
      isEditSuccess: true,
    };

    renderComponent(store);
    expect(screen.getByRole("status", { hidden: true })).toBeInTheDocument();
  });
});
