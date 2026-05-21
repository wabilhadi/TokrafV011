import { useLanguageStore } from '../store/languageStore';
import { dictionary } from '../locales/dictionary';

type DictionaryKey = keyof typeof dictionary.en;

export function useTranslation() {
  const { language } = useLanguageStore();

  const t = (path: string) => {
    const keys = path.split('.');
    let result: any = dictionary[language];
    for (const key of keys) {
      if (result[key] === undefined) {
        return path; // Fallback to path if not found
      }
      result = result[key];
    }
    return result as string;
  };

  return { t, language };
}
