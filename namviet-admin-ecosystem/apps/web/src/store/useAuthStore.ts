import { create } from 'zustand';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role_id: string;
  company_id?: number;
  warehouse_id?: number;
}

interface AuthState {
  user: UserProfile | null;
  permissions: string[]; // Mảng chứa các menu href được phép truy cập, ví dụ: ['/roles', '/users']
  isAuthenticated: boolean;
  setAuth: (user: UserProfile, permissions: string[]) => void;
  clearAuth: () => void;
  hasPermission: (href: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  permissions: ['*'], // Tạm thời để '*' để thấy full menu trong lúc code
  isAuthenticated: false,
  setAuth: (user, permissions) => set({ user, permissions, isAuthenticated: true }),
  clearAuth: () => set({ user: null, permissions: [], isAuthenticated: false }),
  hasPermission: (href: string) => {
    const { permissions } = get();
    // Ví dụ: Nếu permissions chứa '*', tức là admin full quyền
    if (permissions.includes('*')) return true;
    // Kiểm tra xem href có nằm trong permissions không (có thể viết logic match đường dẫn ở đây)
    return permissions.some(p => href.startsWith(p));
  }
}));
