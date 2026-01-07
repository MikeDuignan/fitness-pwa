import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/db';

interface UserState {
  user: User | null;
  isOnboarded: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setIsOnboarded: (isOnboarded: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isOnboarded: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null, isOnboarded: false }),
      setIsOnboarded: (isOnboarded) => set({ isOnboarded }),
    }),
    {
      name: 'fitness-user-storage',
    }
  )
);
