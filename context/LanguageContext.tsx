'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { NABTA_CONFIG } from '@/lib/config';
import { NABTA_I18N, type TranslationKey } from '@/lib/i18n';
import type { Lang, LocalizedText } from '@/types/nabta';

interface LanguageContextValue {
  lang: Lang;
  isRtl: boolean;
  setLanguage: (next: Lang) => void;
  toggleLang: () => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  L: (obj?: LocalizedText | null) => string;
  numFmt: (n: number) => string;
}

const STORAGE_KEY = 'nabta-lang';
const LanguageContext = createContext<LanguageContextValue | null>(null);

function getStoredLang(): Lang | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === 'ar' || val === 'en') return val;
  } catch {
    // ignore storage errors
  }
  return null;
}

function setStoredLang(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore storage errors
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar');

  useEffect(() => {
    const stored = getStoredLang();
    if (stored) {
      setLang(stored);
      return;
    }
    if (NABTA_CONFIG.defaultLanguage === 'en') {
      setLang('en');
    } else if (NABTA_CONFIG.defaultLanguage === 'auto') {
      const detected: Lang = (navigator.language || 'ar').toLowerCase().startsWith('ar')
        ? 'ar'
        : 'en';
      setLang(detected);
    } else {
      setLang('ar');
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      let s = NABTA_I18N[lang][key] ?? NABTA_I18N.ar[key] ?? key;
      if (vars) {
        for (const k of Object.keys(vars)) {
          s = s.replace(`{${k}}`, String(vars[k]));
        }
      }
      return s;
    },
    [lang]
  );

  const L = useCallback(
    (obj?: LocalizedText | null): string => {
      return (obj && (obj[lang] ?? obj.ar ?? obj.en)) || '';
    },
    [lang]
  );

  const numFmt = useCallback(
    (n: number): string => {
      return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en').format(n);
    },
    [lang]
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const setLanguage = useCallback((next: Lang) => {
    setStoredLang(next);
    setLang(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next: Lang = prev === 'ar' ? 'en' : 'ar';
      setStoredLang(next);
      return next;
    });
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      isRtl: lang === 'ar',
      setLanguage,
      toggleLang,
      t,
      L,
      numFmt,
    }),
    [lang, setLanguage, toggleLang, t, L, numFmt]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
