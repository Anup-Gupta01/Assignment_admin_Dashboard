import { create } from "zustand";

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  initFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  // Rehydrate from localStorage on app load
  initFromStorage: () => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      set({ user: JSON.parse(stored) });
    }
  },

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      if (username === "dummy" && password === "dummypass") {
        const dummyUser: User = {
          id: 999,
          username: "dummy",
          email: "dummy@example.com",
          firstName: "Dummy",
          lastName: "User",
          token: "dummy-token",
        };
        localStorage.setItem("auth_user", JSON.stringify(dummyUser));
        set({ user: dummyUser, loading: false });
        return true;
      }

      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, expiresInMins: 60 }),
      });

      if (!res.ok) {
        const data = await res.json();
        set({ error: data.message || "Invalid credentials", loading: false });
        return false;
      }

      const data = await res.json();
      const user: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        token: data.accessToken,
      };

      localStorage.setItem("auth_user", JSON.stringify(user));
      set({ user, loading: false });
      return true;
    } catch {
      set({ error: "Network error. Please try again.", loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("auth_user");
    set({ user: null });
  },
}));
