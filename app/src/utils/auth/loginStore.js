import { create } from 'zustand';

/**
 * Simple store for mock MyDigital ID login state
 */
export const useLoginStore = create((set) => ({
  isLoggedIn: false,
  userName: "",
  setLoggedIn: (userName) => set({ isLoggedIn: true, userName }),
  logout: () => set({ isLoggedIn: false, userName: "" }),
}));

