import { create } from 'zustand';
import { storage } from '../services/storage';
import { User } from '../types';

interface AuthStore {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: User) => Promise<void>;
  setGuest: () => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,

  setAuth: async (token: string, user: User) => {
    await storage.setItemAsync('token', token);
    await storage.setItemAsync('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true, isGuest: false, isLoading: false });
  },

  setGuest: () => {
    set({ token: null, user: null, isAuthenticated: false, isGuest: true, isLoading: false });
  },

  logout: async () => {
    await storage.deleteItemAsync('token');
    await storage.deleteItemAsync('user');
    set({ token: null, user: null, isAuthenticated: false, isGuest: false, isLoading: false });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  loadStoredAuth: async () => {
    try {
      const token = await storage.getItemAsync('token');
      const userStr = await storage.getItemAsync('user');
      if (token && userStr) {
        const user = JSON.parse(userStr) as User;
        set({ token, user, isAuthenticated: true, isGuest: false, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
