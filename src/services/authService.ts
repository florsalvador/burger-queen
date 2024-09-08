import { LoginResponse, User, Session } from "../models/auth";
import { API_URL } from "../settings";

export async function loginService(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error("Invalid credentials");
  }
  const { accessToken, user } = await response.json();
  return { accessToken, user };
}

export function createSession(token: string, user: User) {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
};

export function getSession(): Session {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  return { token, user };
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
