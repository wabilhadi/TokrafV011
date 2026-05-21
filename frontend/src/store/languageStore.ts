import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'id' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en', // Default to English as per current UI
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'id' : 'en' })),
    }),
    {
      name: 'tokraf-language-storage',
    }
  )
);
