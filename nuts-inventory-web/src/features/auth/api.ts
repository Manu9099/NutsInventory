import { apiClient } from "../../lib/api-client";
import type { AuthUser } from "./auth-store";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  expiresAt: string;
  user: AuthUser;
};

export type MeResponse = AuthUser;

export function login(request: LoginRequest) {
  return apiClient<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function getMe() {
  return apiClient<MeResponse>("/auth/me");
}