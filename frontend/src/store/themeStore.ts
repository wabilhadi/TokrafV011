import { create } from 'zustand';

type ThemeState = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => {
  // Check initial theme from system or localStorage
  const storedTheme = localStorage.getItem('tokraf-theme') as 'light' | 'dark' | null;
  const initialTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  // Apply initially
  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }

  return {
    theme: initialTheme,
    toggleTheme: () => set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('tokraf-theme', newTheme);
      
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return { theme: newTheme };
    }),
  };
});
