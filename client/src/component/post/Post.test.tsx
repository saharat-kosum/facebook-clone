import { describe, it, expect } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../utils/test-utils";
import { BrowserRouter } from "react-router-dom";
import { AuthInitialState, CommentType, PostType } from "../../type";
import Post from "./Post";
import * as postSlice from "../../redux/postSlice";

const user = {
  _id: "user1",
  dateOfBirth: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
};

describe("Post Component", () => {
  const renderComponent = (
    auth: AuthInitialState | undefined,
    post: PostType
  ) =>
    renderWithProviders(
      <BrowserRouter>
        <Post post={post} />
      </BrowserRouter>,
      {
        preloadedState: {
          auth,
        },
      }
    );

  const comment: CommentType = {
    description: "This is a comment",
    userPicturePath: "",
    firstName: "John",
    lastName: "Doe",
  };

  const post: PostType = {
    _id: "1",
    userId: "user1",
    firstName: "First",
    lastName: "Last",
    description: "Post description",
    createdAt: new Date(),
    userPicturePath: "",
    picturePath: "",
    likes: ["user1"],
    comments: [comment],
  };

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

  it("render post correctly", () => {
    renderComponent(undefined, post);
    expect(screen.getByText("First Last")).toBeInTheDocument();
    expect(screen.getByText("Post description")).toBeInTheDocument();
    expect(screen.getByText("This is a comment")).toBeInTheDocument();
    expect(screen.getByAltText("postProfile")).toBeInTheDocument();
  });

  it("dispatches likePostThunk when like button is clicked", () => {
    if (!auth.user) {
      throw new Error("auth.user is null or undefined");
    }

    const spy = vi.spyOn(postSlice, "likePostThunk");
    renderComponent(auth, post);

    fireEvent.click(screen.getByText("Like"));

    expect(spy).toHaveBeenCalledWith({ id: post._id, userId: auth.user._id });
  });

  it("dispatches commentPostThunk when a comment is added", async () => {
    if (!auth.user) {
      throw new Error("auth.user is null or undefined");
    }

    const spy = vi.spyOn(postSlice, "commentPostThunk");
    renderComponent(auth, post);

    fireEvent.change(screen.getByPlaceholderText("Write a comment..."), {
      target: { value: "New comment" },
    });
    fireEvent.click(screen.getByRole("commentBtn"));

    const firstName = auth.user.firstName;
    const lastName = auth.user.lastName;
    const userPicturePath = auth.user.picturePath;

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith({
        id: post._id,
        newComment: {
          firstName,
          lastName,
          userPicturePath,
          description: "New comment",
        },
      });
    });
  });

  it("dispatches deletePostThunk when delete button is clicked", async () => {
    if (!auth.user) {
      throw new Error("auth.user is null or undefined");
    }

    const spy = vi.spyOn(postSlice, "deletePostThunk");
    renderComponent(auth, post);

    if (post.userId === auth.user._id) {
      window.confirm = vi.fn(() => true);
      fireEvent.click(screen.getByRole("deleteBtn"));

      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith(post._id);
      });
    } else {
      throw new Error("post.userId not equal to auth.user._id");
    }
  });

  it("renders comments and allows editing and deleting them", async () => {
    if (!auth.user) {
      throw new Error("auth.user is null or undefined");
    }

    const editSpy = vi.spyOn(postSlice, "editPost");
    renderComponent(auth, post);

    expect(screen.getByText("This is a comment")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.change(screen.getByPlaceholderText("Edit a comment..."), {
      target: { value: "Updated comment" },
    });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(editSpy).toHaveBeenCalledWith({
        ...post,
        comments: [
          {
            ...comment,
            description: "Updated comment",
          },
        ],
      });
    });

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(editSpy).toHaveBeenCalledWith({
        ...post,
        comments: [],
      });
    });
  });
});
