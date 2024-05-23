import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthInitialState } from "../type";
import { renderWithProviders } from "../utils/test-utils";
import Contact from "./Contact";
import axios from "axios";

vi.mock("axios");
const axiosGet = vi.fn();
const axiosPut = vi.fn();

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

const mockSuggestUsers = [
  {
    _id: "userId2",
    firstName: "suggest1",
    lastName: "suggest2",
    picturePath: "/suggest1.jpg",
  },
];

const mockFriends = [
  {
    _id: "userId3",
    firstName: "friend1",
    lastName: "friend2",
    picturePath: "/friend1.jpg",
  },
];

describe("Contact Component", () => {
  beforeEach(() => {
    axios.get = axiosGet;
    axios.put = axiosPut;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const renderComponent = (auth: AuthInitialState | undefined) =>
    renderWithProviders(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>,
      {
        preloadedState: {
          auth,
        },
      }
    );

  it("contact render correctly", () => {
    renderComponent(undefined);
    expect(screen.getByText("Birthdays")).toBeInTheDocument();
    expect(screen.getByText("Suggestions")).toBeInTheDocument();
    expect(screen.getByText("Contacts")).toBeInTheDocument();
  });

  it("fetches and displays suggested users and friends", async () => {
    axiosGet
      .mockResolvedValueOnce({ data: mockSuggestUsers })
      .mockResolvedValueOnce({ data: mockFriends });

    renderComponent(auth);

    await waitFor(() => {
      expect(screen.getByText("suggest1 suggest2")).toBeInTheDocument();
      expect(screen.getByText("friend1 friend2")).toBeInTheDocument();
    });
  });

  it("navigates to profile on user click", async () => {
    axiosGet.mockResolvedValueOnce({ data: mockSuggestUsers });

    renderComponent(auth);

    await waitFor(() => {
      const suggestUser = screen.getByText("suggest1 suggest2");
      fireEvent.click(suggestUser);
    });

    expect(window.location.pathname).toBe("/profile/userId2");
  });

  it("adds a friend", async () => {
    axiosGet.mockResolvedValueOnce({ data: mockSuggestUsers });
    axiosPut.mockResolvedValueOnce({ status: 200 });

    renderComponent(auth);

    await waitFor(() => {
      const addButton = screen.getByRole("button");
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(`/users/userId1/userId2`, {
        userId: "userId1",
      });
    });
  });

  it("removes a friend", async () => {
    axiosGet
      .mockResolvedValueOnce({ data: mockSuggestUsers })
      .mockResolvedValueOnce({ data: mockFriends });
    axiosPut.mockResolvedValueOnce({ status: 200 });

    renderComponent(auth);

    await waitFor(() => {
      const removeButton = screen.getByRole("rmButton");
      fireEvent.click(removeButton);
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(`/users/userId1/userId3`, {
        userId: "userId1",
      });
    });
  });
});
