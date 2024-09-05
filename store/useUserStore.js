import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      token: null,
      userData: null,
      setToken: (token) => set({ token }),
      setUserData: (userData) => set({ userData }),
    }),
    {
      name: "user-storage",
      getStorage: () => localStorage,
    }
  )
);
