import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Loading from "./Loading";

describe("Loading Component", () => {
  it("should be visible when isShow is true", () => {
    render(<Loading isShow={true} />);
    const modal = screen.getByRole("dialog");
    expect(modal).toBeVisible();
    expect(modal).toHaveClass("show");
    expect(modal).toHaveStyle("display: block");
  });

  it("should not be visible when isShow is false", () => {
    render(<Loading isShow={false} />);
    const modal = screen.getByRole("dialog", { hidden: true });
    expect(modal).not.toBeVisible();
    expect(modal).not.toHaveClass("show");
    expect(modal).toHaveStyle("display: none");
  });

  it('should have a spinner with the text "Loading..."', () => {
    render(<Loading isShow={true} />);
    const spinner = screen.getByRole("status");
    const loadingText = screen.getByText("Loading ..");
    expect(spinner).toBeInTheDocument();
    expect(loadingText).toBeInTheDocument();
  });
});
