import { create } from "zustand";

export type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  role: string;
};

type AuthState = {
  accessToken: string | null;
  expiresAt: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (payload: {
    accessToken: string;
    expiresAt: string;
    user: AuthUser;
  }) => void;
  clearSession: () => void;
  hydrate: () => void;
};

const TOKEN_KEY = "nuts_access_token";
const EXPIRES_KEY = "nuts_expires_at";
const USER_KEY = "nuts_user";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  expiresAt: null,
  user: null,
  isAuthenticated: false,

  setSession: ({ accessToken, expiresAt, user }) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(EXPIRES_KEY, expiresAt);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    set({
      accessToken,
      expiresAt,
      user,
      isAuthenticated: true,
    });
  },

  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_KEY);
    localStorage.removeItem(USER_KEY);

    set({
      accessToken: null,
      expiresAt: null,
      user: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    const accessToken = localStorage.getItem(TOKEN_KEY);
    const expiresAt = localStorage.getItem(EXPIRES_KEY);
    const userRaw = localStorage.getItem(USER_KEY);

    if (!accessToken || !expiresAt || !userRaw) {
      set({
        accessToken: null,
        expiresAt: null,
        user: null,
        isAuthenticated: false,
      });
      return;
    }

    const expired = new Date(expiresAt).getTime() <= Date.now();

    if (expired) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EXPIRES_KEY);
      localStorage.removeItem(USER_KEY);

      set({
        accessToken: null,
        expiresAt: null,
        user: null,
        isAuthenticated: false,
      });
      return;
    }

    set({
      accessToken,
      expiresAt,
      user: JSON.parse(userRaw),
      isAuthenticated: true,
    });
  },
}));