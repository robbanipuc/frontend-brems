import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '@/utils/constants';
import en from '@/translations/en';
import bn from '@/translations/bn';

const translations = { en, bn };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.LOCALE);
    return stored === 'bn' ? 'bn' : 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOCALE, locale);
    document.documentElement.lang = locale === 'bn' ? 'bn' : 'en';
    document.documentElement.classList.toggle('lang-bangla', locale === 'bn');
  }, [locale]);

  const setLocale = useCallback((value) => {
    setLocaleState(value === 'bn' ? 'bn' : 'en');
  }, []);

  const t = useCallback(
    (key, replacements = {}) => {
      const value = key.split('.').reduce((obj, k) => obj?.[k], translations[locale]);
      if (value == null) return key;
      if (typeof value !== 'string') return key;
      return Object.entries(replacements).reduce(
        (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
        value
      );
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isBangla: locale === 'bn' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
