import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../components/App";
import { getSession, loginService } from "../services/authService";
import { User } from "../models/auth";

global.Request = jest.fn();

jest.mock("../services/authService", () => {
  return {
    createSession: jest.fn(),
    getSession: jest.fn(),
    loginService: jest.fn(),
  };
});

const mockedLoginService = loginService as jest.MockedFunction<typeof loginService>;
const mockedGetSession = getSession as jest.MockedFunction<typeof getSession>;

describe("App", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Renders home page when login is successful", async () => {
    const userMock: User = {
      id: 1,
      role: "admin",
      email: "test@email.com",
    };
    mockedLoginService.mockResolvedValueOnce({
      accessToken: "token",
      user: userMock,
    });
    mockedGetSession
      .mockReturnValue({ // default
        token: "token",
        user: userMock,
      })
      .mockReturnValueOnce({ // the first time it's called
        token: null,
        user: null,
      });
    render(<App />)
    const emailInput = screen.getByTestId("emailInput");
    const passwordInput = screen.getByTestId("passwordInput");
    const submitButton = screen.getByTestId("submitButton");
    await userEvent.type(emailInput, "test@email.com");
    await userEvent.type(passwordInput, "12345");
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByTestId("logoutBtn")).toBeInTheDocument();
      expect(window.location.pathname).toBe("/");
    });
  });

  test("Renders login page when no active session exists", () => {
    // console.log("pathname initial", window.location.pathname);
    mockedGetSession.mockReturnValue({
      token: null,
      user: null,
    })
    render(<App />)
    // console.log("pathname after render", window.location.pathname);
    expect(window.location.pathname).toBe("/login");
  });

  test("Shows error message when login fails", async () => {
    mockedGetSession.mockReturnValue({
      token: null,
      user: null,
    })
    mockedLoginService.mockRejectedValueOnce(new Error("Invalid credentials"));
    render(<App />)
    const emailInput = screen.getByTestId("emailInput");
    const passwordInput = screen.getByTestId("passwordInput");
    const submitButton = screen.getByTestId("submitButton");
    await userEvent.type(emailInput, "test@email.com");
    await userEvent.type(passwordInput, "12345");
    await userEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByTestId("errorLogin")).toBeInTheDocument();
    });
  });
  
});
