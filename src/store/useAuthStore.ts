import { create } from 'zustand';

type UserType = 'personal' | 'company' | null;

interface AuthState {
  userType: UserType;
  isAuthenticated: boolean;
  login: (type: UserType) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userType: null,
  isAuthenticated: false,
  login: (type) => set({ userType: type, isAuthenticated: true }),
  logout: () => set({ userType: null, isAuthenticated: false }),
}));
