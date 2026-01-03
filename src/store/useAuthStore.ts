import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type UserType = 'personal' | 'company' | 'admin' | null;
type AdminRole = 'super' | 'partner' | 'agent' | null;

interface AuthState {
  isAuthenticated: boolean;
  userType: UserType;
  adminRole: AdminRole;
  adminTargetId: number | null;
  user: any | null; // Holding full user object
  login: (type: UserType, userData?: any, adminRole?: AdminRole, adminTargetId?: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userType: null,
      adminRole: null,
      adminTargetId: null,
      user: null,
      login: (type, userData, adminRole, adminTargetId) => set({
        isAuthenticated: true,
        userType: type,
        user: userData || null,
        adminRole: adminRole || (type === 'admin' ? 'super' : null),
        adminTargetId: adminTargetId ?? (userData?.id && (adminRole === 'partner' || adminRole === 'agent') ? Number(userData.id) : null)
      }),
      logout: () => set({ isAuthenticated: false, userType: null, adminRole: null, adminTargetId: null, user: null }),
    }),
    {
      name: 'mall-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
