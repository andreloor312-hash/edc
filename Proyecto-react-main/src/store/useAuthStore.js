import { create } from 'zustand';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  authModalOpen: false,

  setUser: (user) => set({ user, loading: false }),
  openAuthModal: () => set({ authModalOpen: true }),
  closeAuthModal: () => set({ authModalOpen: false }),
  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },
}));