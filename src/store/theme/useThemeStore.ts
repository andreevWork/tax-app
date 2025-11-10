import { create } from 'zustand';

type ThemeType = 'light' | 'dark';

interface ThemeState {
  theme: ThemeType;
  isSidebarOpen: boolean;
  language: string;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setLanguage: (lang: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',
  isSidebarOpen: true,
  language: 'en',

  toggleTheme: () => {
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    }));
  },

  toggleSidebar: () => {
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    }));
  },

  setLanguage: (lang: string) => {
    set({ language: lang });
  },
}));
