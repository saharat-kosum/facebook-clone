import { describe, it, expect } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { renderWithProviders } from "../../utils/test-utils";
import { AuthInitialState } from "../../type";
import CreatePostModal from "./CreatePostModal";
import extraReducers from "../../redux/postSlice";
import axios from "axios";

vi.mock("axios");

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

  // it("handles post creation correctly", async () => {
  //   renderComponent(undefined);

  //   const textArea = screen.getByPlaceholderText(
  //     "What's on your mind"
  //   ) as HTMLTextAreaElement;
  //   fireEvent.change(textArea, { target: { value: "John" } });

  //   const file = new File(["hello"], "hello.png", { type: "image/png" });
  //   const dropzone = screen.getByTestId("file-dropzone");

  //   fireEvent.change(dropzone, { target: { files: [file] } });

  //   const postBtn = screen.getByText("Post");
  //   fireEvent.click(postBtn);

  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append(
  //     "postData",
  //     JSON.stringify({ userId: "", description: "John" })
  //   );

  //   await waitFor(() => {
  //     expect(axios.post).toHaveBeenCalledWith("/posts", formData);
  //   });
  // });

  // it("clears input fields after posting", async () => {
  //   renderComponent({ user: { _id: "123", firstName: "John", lastName: "Doe", picturePath: "path/to/picture" } });

  //   const textArea = screen.getByPlaceholderText("What's on your mind");
  //   fireEvent.change(textArea, { target: { value: "Some text" } });

  //   const postBtn = screen.getByText("Post");
  //   fireEvent.click(postBtn);

  //   await waitFor(() => {
  //     expect(textArea.value).toBe("");
  //   });
  // });
});
