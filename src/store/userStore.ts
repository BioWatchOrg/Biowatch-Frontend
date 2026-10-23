import { create } from 'zustand';

type UserState = {
  isAuthenticated: boolean;
  // Placeholder: Firebase remplacera le corps de signIn / signOut dans un sprint ulterieur.
  signIn: () => void;
  signOut: () => void;
};

export const useUserStore = create<UserState>()((set) => ({
  isAuthenticated: false,
  signIn: () => set({ isAuthenticated: true }),
  signOut: () => set({ isAuthenticated: false }),
}));
