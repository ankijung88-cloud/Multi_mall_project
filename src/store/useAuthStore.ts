import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type UserType = 'personal' | 'company' | 'admin' | null;
type AdminRole = 'super' | 'partner' | 'agent' | 'freelancer' | null;

interface AuthState {
  viewMode: 'personal' | 'company';
  isAuthenticated: boolean;
  userType: UserType;
  adminRole: AdminRole;
  adminTargetId: number | null;
  user: any | null; // Holding full user object
  setViewMode: (mode: 'personal' | 'company') => void;
  login: (type: UserType, userData?: any, adminRole?: AdminRole, adminTargetId?: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      viewMode: 'personal',
      isAuthenticated: false,
      userType: null,
      adminRole: null,
      adminTargetId: null,
      user: null,
      setViewMode: (mode) => set({ viewMode: mode }),
      login: (type, userData, adminRole, adminTargetId) => set({
        isAuthenticated: true,
        userType: type,
        viewMode: type === 'company' ? 'company' : 'personal', // Sync viewMode on login
        user: userData || null,
        adminRole: adminRole || (type === 'admin' ? 'super' : null),
        adminTargetId: adminTargetId ?? (userData?.id && (adminRole === 'partner' || adminRole === 'agent' || adminRole === 'freelancer') ? (typeof userData.id === 'string' && userData.id.startsWith('f') ? userData.id : Number(userData.id)) : null)
      }),
      logout: () => set(state => ({
        isAuthenticated: false,
        userType: null,
        adminRole: null,
        adminTargetId: null,
        user: null,
        // Keep viewMode as is, or reset? Let's keep it to stay on current "portal"
        viewMode: state.viewMode
      })),
    }),
    {
      name: 'mall-auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          // Check session first, then local
          const session = sessionStorage.getItem(name);
          if (session) return session;
          return localStorage.getItem(name);
        },
        setItem: (name, value) => {
          try {
            const parsed = JSON.parse(value);
            // Check if login as admin
            if (parsed.state?.userType === 'admin') {
              sessionStorage.setItem(name, value);
              // Clean up local if exists to avoid confusion/stale data
              localStorage.removeItem(name);
            } else {
              // Personal/Company -> LocalStorage
              localStorage.setItem(name, value);
              sessionStorage.removeItem(name);
            }
          } catch (err) {
            // Fallback
            localStorage.setItem(name, value);
          }
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
          localStorage.removeItem(name);
        },
      })),
    }
  )
);
