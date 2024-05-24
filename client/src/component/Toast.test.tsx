import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Toast from "./Toast";

describe("Toast component", () => {
  it("renders correctly with success message", () => {
    const message = "Success message";
    render(<Toast message={message} isSuccess={true} />);

    const toastElement = screen.getByRole("alert");
    expect(toastElement).toHaveClass("bg-success");
    expect(toastElement).toHaveTextContent(message);
  });

  it("renders correctly with error message", () => {
    const message = "Error message";
    render(<Toast message={message} isSuccess={false} />);

    const toastElement = screen.getByRole("alert");
    expect(toastElement).toHaveClass("bg-danger");
    expect(toastElement).toHaveTextContent(message);
  });

  it("renders a close button", () => {
    render(<Toast message="Test message" isSuccess={true} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });
});
