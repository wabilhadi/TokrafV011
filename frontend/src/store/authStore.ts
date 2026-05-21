import { create } from 'zustand';

type AuthState = {
  token: string | null;
  user: any | null;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('tokraf-admin-token'),
  user: JSON.parse(localStorage.getItem('tokraf-admin-user') || 'null'),
  setAuth: (token, user) => {
    localStorage.setItem('tokraf-admin-token', token);
    localStorage.setItem('tokraf-admin-user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('tokraf-admin-token');
    localStorage.removeItem('tokraf-admin-user');
    set({ token: null, user: null });
  },
}));
