import { create } from "zustand";

export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  company: { name: string };
  image: string;
}

export interface UserDetail extends UserSummary {
  age: number;
  birthDate: string;
  address: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  username: string;
  role: string;
  department: string;
}

interface UsersState {
  users: UserSummary[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  searchQuery: string;
  fetchUsers: (page: number, pageSize: number, query: string) => Promise<void>;
  setPage: (page: number) => void;
  setSearch: (query: string) => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  loading: false,
  error: null,
  page: 0,
  pageSize: 10,
  searchQuery: "",

  setPage: (page) => {
    set({ page });
    const { pageSize, searchQuery } = get();
    get().fetchUsers(page, pageSize, searchQuery);
  },

  setSearch: (query) => {
    set({ searchQuery: query, page: 0 });
    const { pageSize } = get();
    get().fetchUsers(0, pageSize, query);
  },

  fetchUsers: async (page, pageSize, query) => {
    set({ loading: true, error: null });
    try {
      const skip = page * pageSize;
      const url = query
        ? `https://dummyjson.com/users/search?q=${encodeURIComponent(query)}&limit=${pageSize}&skip=${skip}`
        : `https://dummyjson.com/users?limit=${pageSize}&skip=${skip}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      set({ users: data.users, total: data.total, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Something went wrong",
        loading: false,
      });
    }
  },
}));
