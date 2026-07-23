'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import en from './dictionaries/en.json';
import ar from './dictionaries/ar.json';
import tr from './dictionaries/tr.json';

export type Language = 'ar' | 'tr' | 'en';

const dictionaries: Record<Language, any> = { en, ar, tr };

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar'); // Default to Arabic as requested
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('morm_lang') as Language;
    if (saved && (saved === 'ar' || saved === 'tr' || saved === 'en')) {
      setLanguageState(saved);
      applyLanguageSettings(saved);
    } else {
      applyLanguageSettings('ar');
    }
    setMounted(true);
  }, []);

  const applyLanguageSettings = (lang: Language) => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('morm_lang', lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    applyLanguageSettings(lang);
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let current = dictionaries[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English if key missing
        let fallbackVal = dictionaries['en'];
        for (const fk of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fk in fallbackVal) {
            fallbackVal = fallbackVal[fk];
          } else {
            return fallback || path;
          }
        }
        return typeof fallbackVal === 'string' ? fallbackVal : fallback || path;
      }
    }

    return typeof current === 'string' ? current : fallback || path;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
