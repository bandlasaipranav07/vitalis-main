import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import { Language } from '../types';
import { getTranslations, Translations } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language when app starts
  useEffect(() => {
    const savedLanguage = localStorage.getItem('vitalis_lang');

    if (savedLanguage) {
      setLanguageState(savedLanguage as Language);
    }

    // Apply language to entire HTML document
    document.documentElement.lang = savedLanguage || 'en';
  }, []);

  // Get translations for selected language
  const t = getTranslations(language);

  // Change language everywhere instantly
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);

    // Save selected language
    localStorage.setItem('vitalis_lang', lang);

    // Update HTML language globally
    document.documentElement.lang = lang;

    // Force app re-render
    window.dispatchEvent(new Event('languageChanged'));
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used inside LanguageProvider'
    );
  }

  return context;
}
