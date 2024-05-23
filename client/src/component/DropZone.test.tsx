import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DropZone from "./DropZone";

describe("FileDropzone Component", () => {
  const filesAdd = vi.fn();

  beforeEach(() => {
    render(<DropZone onFileAdded={filesAdd} />);
  });

  it("should render the dropzone component", () => {
    expect(
      screen.getByText(/Drag & drop files here, or click to select files/i)
    ).toBeInTheDocument();
  });
});
