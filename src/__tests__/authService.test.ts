import "@testing-library/jest-dom";
import { loginService, createSession, getSession, clearSession } from "../services/authService";
import { User } from "../models/auth";

describe("loginService", () => {
  test("Returns an access token", async () => {
    const email = "admin@systers.xyz";
    const password = "correct password";
    const mockResponse = {
      accessToken: "fake-token",
      user: { email: "admin@systers.xyz", role: "admin", id: 1 },
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    ) as jest.Mock;
    const result = await loginService(email, password);
    expect(result).toEqual(mockResponse);
  });

  test("Returns an error if the email or password are incorrect", async () => {
    const email = "admin@systers.xyz";
    const password = "wrong password";
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () => Promise.resolve({ message: "error"}),
      }),
    ) as jest.Mock;
    try {
      await loginService(email, password);
    } catch (error) { 
      expect(error).toBeInstanceOf(Error);
    }
  });
});

const mockLocalStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    getItem: jest.fn((key: string) => { return store[key] || null }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});
const token = "fake-token";
const user: User = { email: "admin@systers.xyz", role: "admin", id: 1 };

describe("createSession", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test("Saves token and user in localStorage", () => {
    createSession(token, user);
    expect(mockLocalStorage.getItem("token")).toBe(token);
    expect(JSON.parse(mockLocalStorage.getItem("user")!)).toEqual(user);
  });
});

describe("getSession", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test("Returns an object containing a token and user if they are present", () => {
    createSession(token, user);
    const session = getSession();
    expect(session.token).toBe(token);
    expect(session.user).toEqual(user);
  });

  test("Returns an object with null values if the token and user are not present", () => {
    mockLocalStorage.clear();
    const session = getSession();
    expect(session.token).toBeNull();
    expect(session.user).toBeNull();
  });
});

describe("clearSession", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test("Removes token and user from localStorage", () => {
    createSession(token, user);
    clearSession();
    expect(mockLocalStorage.getItem("token")).toBeNull();
    expect(mockLocalStorage.getItem("user")).toBeNull();
  });
});
