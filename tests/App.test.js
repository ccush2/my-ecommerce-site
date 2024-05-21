import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import App from "../src/App";
import "@testing-library/jest-dom";
import axios from "axios";

jest.mock("axios");

describe("App component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  test("renders Navbar component", async () => {
    await act(async () => {
      render(<App />);
    });
    const navbarElement = screen.getByRole("navigation");
    expect(navbarElement).toBeInTheDocument();
  });

  test("handles user login", async () => {
    const user = { id: 1, username: "testuser", token: "mockToken" };
    axios.post.mockResolvedValueOnce({ data: user });

    await act(async () => {
      render(<App />);
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Login"));
    });

    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password:");
    const loginButton = screen.getByRole("button", { name: "Login" });

    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "password" } });
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:3001/login", {
        username: "testuser",
        password: "password",
      });
    });
  });

  test("handles user logout", async () => {
    localStorage.setItem("authToken", "mockToken");
    axios.post.mockResolvedValueOnce({ data: {} });

    await act(async () => {
      render(<App />);
    });

    await act(async () => {
      const logoutButton = screen.getByText("Logout");
      fireEvent.click(logoutButton);
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "/logout",
        null,
        expect.any(Object)
      );
      expect(localStorage.getItem("authToken")).toBeNull();
    });
  });
});
