// store.js
import create from "zustand";

export const useUserStore = create((set) => ({
  token: null,
  userData: null,
  setToken: (token) => set({ token }),
  setUserData: (userData) => set({ userData }),
}));
