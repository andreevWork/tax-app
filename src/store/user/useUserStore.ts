import { create } from 'zustand';

interface UserState {
  username: string;
  email: string;
  isLoggedIn: boolean;

  login: (username: string, email: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  username: '',
  email: '',
  isLoggedIn: false,

  login: (username: string, email: string) => {
    set({
      username,
      email,
      isLoggedIn: true,
    });
  },

  logout: () => {
    set({
      username: '',
      email: '',
      isLoggedIn: false,
    });
  },
}));
