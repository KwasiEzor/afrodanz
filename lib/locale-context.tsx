'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  defaultLocale,
  Locale,
  isSupportedLocale,
  translate,
} from '@/lib/i18n';
import { COOKIE_MAX_AGE, COOKIE_NAME } from './locale.constants';

const STORAGE_KEY = 'afrodanz_locale';

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>({
  locale: defaultLocale,
  setLocale: () => {},
});

export function LocaleProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY) ?? undefined;

    if (isSupportedLocale(stored)) {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, locale);
    document.cookie = `${COOKIE_NAME}=${locale}; path=/; max-age=${COOKIE_MAX_AGE};`;
  }, [locale]);

  const contextValue = useMemo(
    () => ({ locale, setLocale: setLocaleState }),
    [locale]
  );

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useTranslation() {
  const { locale } = useLocale();

  return (key: string, fallback?: string) => translate(locale, key, fallback);
}
