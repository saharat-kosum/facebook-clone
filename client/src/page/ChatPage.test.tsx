import { describe, it, expect } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthInitialState, UserType } from "../type";
import { renderWithProviders } from "../utils/test-utils";
import { useMediaQuery } from "../utils/useMediaQuery";
import ChatPage from "./ChatPage";
import axios from "axios";
import * as authSlice from "../redux/authSlice";

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

const friends: UserType[] = [
  {
    _id: "friendId1",
    dateOfBirth: "",
    firstName: "friendFirst1",
    lastName: "friendLast1",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picturePath: "/picture1",
  },
  {
    _id: "friendId2",
    dateOfBirth: "",
    firstName: "friendFirst2",
    lastName: "friendLast2",
    email: "",
    password: "",
    location: "",
    occupation: "",
    picturePath: "/picture2",
  },
];

const auth: AuthInitialState = {
  mode: "Register",
  user: user,
  profile: null,
  mockIMG: "/mock",
  loading: false,
  token: "validToken",
  friends: friends,
  isRegisterSuccess: false,
  isLoginSuccess: false,
  isEditSuccess: false,
};

describe("Chatpage", () => {
  const renderComponent = (auth: AuthInitialState | undefined) =>
    renderWithProviders(
      <BrowserRouter>
        <ChatPage />
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

  it("Chat page render correcly", () => {
    renderComponent(auth);
    expect(screen.getByText(/Chats/i)).toBeInTheDocument();
  });

  it("displays loading spinner when authLoading is true", () => {
    renderComponent({ ...auth, loading: true });
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("calls getFriends when component mounts", async () => {
    const spy = vi.spyOn(authSlice, "getFriends");

    renderComponent(auth);

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith(user._id);
    });
  });

  it("loads chat history when a friend is clicked", async () => {
    const get = vi.fn();
    axios.get = get;
    get.mockResolvedValue({
      data: [
        { sender: "friendId1", message: "hello world", receiver: "userId1" },
      ],
    });

    renderComponent(auth);

    const friendItem = screen.getByText(/friendFirst1 friendLast1/i);
    fireEvent.click(friendItem);

    await waitFor(() => {
      const friendItem = screen.getByText(/friendFirst1 friendLast1/i);
      fireEvent.click(friendItem);
    });
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/chats/friendId1");
    });

    expect(screen.getByText("hello world")).toBeInTheDocument();
  });
});
