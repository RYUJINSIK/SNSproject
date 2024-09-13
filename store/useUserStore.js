import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create(
  devtools(
    persist(
      (set) => ({
        token: null,
        userData: null,
        setToken: (token) => set({ token }),
        setUserData: (userData) => set({ userData }),
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => {
          if (typeof window !== "undefined") {
            return localStorage;
          }
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }),
      }
    )
  )
);
