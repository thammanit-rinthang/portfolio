"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Locale } from "./locale";

const STORAGE_KEY = "portfolio_locale";

interface LocaleContextValue {
  locale: Locale;
  toggle: () => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  toggle: () => {},
});

interface LocaleProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
}

export function LocaleProvider({ children, initialLocale }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  // Sync state & cookies on mount from localStorage if custom preference exists
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    let timer: NodeJS.Timeout | undefined;
    if (saved === "th" || saved === "en") {
      if (saved !== initialLocale) {
        timer = setTimeout(() => {
          setLocale(saved);
        }, 0);
      }
      document.cookie = `${STORAGE_KEY}=${saved}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      localStorage.setItem(STORAGE_KEY, initialLocale);
      document.cookie = `${STORAGE_KEY}=${initialLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [initialLocale]);

  // Reflect locale on the <html lang> attribute for assistive tech
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const toggle = useCallback(() => {
    setLocale((prev) => {
      const next: Locale = prev === "en" ? "th" : "en";
      localStorage.setItem(STORAGE_KEY, next);
      document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000; SameSite=Lax`;
      return next;
    });
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, toggle }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
