import axios from "axios";
import setupAxiosInterceptors from "./axios-config";
import { vi, beforeEach, afterEach, it, expect, describe } from "vitest";

vi.mock("axios");

describe("setupAxiosInterceptors", () => {
  let token: string | null;
  const mockUse = vi.fn();

  beforeEach(() => {
    token = "test-token";
    axios.defaults.baseURL = undefined;
    axios.interceptors.request.use = mockUse;
  });

  afterEach(() => {
    vi.clearAllMocks();
    axios.defaults.baseURL = undefined;
  });

  it("should set axios base URL from environment variable", () => {
    process.env.REACT_APP_PREFIX_URL = "http://test-url.com";
    setupAxiosInterceptors(null);
    expect(axios.defaults.baseURL).toBe("http://test-url.com");
  });

  it("should not set Authorization header if token is not provided", () => {
    setupAxiosInterceptors(null);
    expect(mockUse).not.toHaveBeenCalled();
  });

  it("should set Authorization header if token is provided", () => {
    setupAxiosInterceptors(token);
    expect(mockUse).toHaveBeenCalledTimes(1);

    const [interceptorFunction] = mockUse.mock.calls[0];

    const config = {
      method: "get",
      headers: {
        Authorization: "",
      },
    };

    interceptorFunction(config);
    expect(config.headers?.Authorization).toBe(`Bearer ${token}`);
  });

  it("should handle request error correctly", async () => {
    setupAxiosInterceptors(token);
    const error = new Error("test error");
    const [successInterceptor, errorInterceptor] = mockUse.mock.calls[0];

    await expect(errorInterceptor(error)).rejects.toThrow(error);
  });

  it("should set base URL and Authorization header when both are provided", () => {
    process.env.REACT_APP_PREFIX_URL = "http://test-url.com";
    setupAxiosInterceptors(token);
    expect(axios.defaults.baseURL).toBe("http://test-url.com");

    expect(mockUse).toHaveBeenCalledTimes(1);

    const [interceptorFunction] = mockUse.mock.calls[0];

    const config = {
      method: "get",
      headers: {
        Authorization: "",
      },
    };
    interceptorFunction(config);
    expect(config.headers?.Authorization).toBe(`Bearer ${token}`);
  });
});
