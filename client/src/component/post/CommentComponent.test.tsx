import { describe, it, expect } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthInitialState, CommentType, PostType } from "../../type";
import { renderWithProviders } from "../../utils/test-utils";
import { BrowserRouter } from "react-router-dom";
import CommentComponent from "./CommentComponent";

const editComment = vi.fn();
const deleteComment = vi.fn();

describe("Comment Component", () => {
  const renderComponent = (
    auth: AuthInitialState | undefined,
    comment: CommentType,
    post: PostType
  ) =>
    renderWithProviders(
      <BrowserRouter>
        <CommentComponent
          comment={comment}
          editComment={editComment}
          index={0}
          post={post}
          deleteComment={deleteComment}
        />
      </BrowserRouter>,
      {
        preloadedState: {
          auth,
        },
      }
    );

  const comment: CommentType = {
    description: "This is a comment",
    userPicturePath: "/path/to/user/pic",
    firstName: "John",
    lastName: "Doe",
  };

  const post: PostType = {
    userId: "string",
    firstName: "string",
    lastName: "string",
  };

  it("render comment correctly", () => {
    renderComponent(undefined, comment, post);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("This is a comment")).toBeInTheDocument();
    expect(screen.getByAltText("profile")).toBeInTheDocument();
  });

  it("toggles edit mode", () => {
    renderComponent(undefined, comment, post);
    fireEvent.click(screen.getByText("Edit"));

    expect(
      screen.getByPlaceholderText("Edit a comment...")
    ).toBeInTheDocument();
  });

  it("updates the comment", async () => {
    renderComponent(undefined, comment, post);

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByPlaceholderText("Edit a comment..."), {
      target: { value: "Updated comment" },
    });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(editComment).toHaveBeenCalledWith(post, 0, "Updated comment");
    });
  });

  it("deletes the comment", async () => {
    renderComponent(undefined, comment, post);
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(deleteComment).toHaveBeenCalledWith(post, 0);
    });
  });
});
