import { describe, it, expect } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { renderWithProviders } from "../../utils/test-utils";
import { AuthInitialState } from "../../type";
import CreatePostModal from "./CreatePostModal";
import axios from "axios";

vi.mock("axios");

const user = {
  _id: "123",
  dateOfBirth: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
};

describe("Create Post Component", () => {
  const renderComponent = (auth: AuthInitialState | undefined) =>
    renderWithProviders(
      <BrowserRouter>
        <CreatePostModal />
      </BrowserRouter>,
      {
        preloadedState: {
          auth,
        },
      }
    );

  it("render component correctly", () => {
    renderComponent(undefined);

    const text = screen.getByText("Create Post");
    const btn = screen.getByText("Post");
    const img = screen.getByRole("img", { name: "profile", hidden: true });
    const friends = screen.getByText("Friends");
    const textArea = screen.getByPlaceholderText("What's on your mind");

    expect(text).toBeInTheDocument();
    expect(btn).toBeInTheDocument();
    expect(img).toBeInTheDocument();
    expect(friends).toBeInTheDocument();
    expect(textArea).toBeInTheDocument();
  });

  it("onchange handle correctly", () => {
    renderComponent(undefined);

    const textArea = screen.getByPlaceholderText(
      "What's on your mind"
    ) as HTMLTextAreaElement;
    fireEvent.change(textArea, { target: { value: "John" } });
    expect(textArea.value).toBe("John");
  });

  it("handles file upload correctly", async () => {
    renderComponent(undefined);

    const file = new File(["hello"], "hello.png", { type: "image/png" });
    const dropzone = screen.getByTestId("file-dropzone");

    fireEvent.change(dropzone, { target: { files: [file] } });

    await waitFor(() => {
      const uploadedImg = screen.getByAltText("upload");
      expect(uploadedImg).toBeInTheDocument();
    });
  });

  it("handles post creation correctly", async () => {
    const auth: AuthInitialState = {
      mode: "Register",
      user: user,
      profile: null,
      mockIMG: "",
      loading: false,
      token: "null",
      friends: [],
      isRegisterSuccess: false,
      isLoginSuccess: false,
      isEditSuccess: false,
    };
    renderComponent(auth);

    const textArea = screen.getByPlaceholderText(
      "What's on your mind"
    ) as HTMLTextAreaElement;
    fireEvent.change(textArea, { target: { value: "John" } });

    const file = new File(["hello"], "hello.png", { type: "image/png" });
    const dropzone = screen.getByTestId("file-dropzone");

    fireEvent.change(dropzone, { target: { files: [file] } });

    const postBtn = screen.getByText("Post");
    fireEvent.click(postBtn);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it("clears input fields after posting", async () => {
    const auth: AuthInitialState = {
      mode: "Register",
      user: user,
      profile: null,
      mockIMG: "",
      loading: false,
      token: "null",
      friends: [],
      isRegisterSuccess: false,
      isLoginSuccess: false,
      isEditSuccess: false,
    };
    renderComponent(auth);

    const textArea = screen.getByPlaceholderText(
      "What's on your mind"
    ) as HTMLTextAreaElement;
    fireEvent.change(textArea, { target: { value: "Some text" } });

    const postBtn = screen.getByText("Post");
    fireEvent.click(postBtn);

    await waitFor(() => {
      expect(textArea.value).toBe("");
    });
  });
});
