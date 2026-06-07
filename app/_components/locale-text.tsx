"use client";

import React from "react";
import { useLocale } from "../_lib/locale-context";
import { t } from "../_lib/locale";
import type { Locale } from "../_lib/locale";

/**
 * Renders a locale-aware string in any HTML element (defaults to <span>).
 */
interface LocaleTextProps {
  entry: { en: string; th: string };
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

export function LocaleText({ entry, as: Tag = "span", className }: LocaleTextProps) {
  const { locale } = useLocale();
  return <Tag className={className}>{t(entry, locale)}</Tag>;
}

/**
 * Render-prop pattern for locale-aware JSX.
 */
export function LocaleConsumer({ children }: { children: (locale: Locale) => React.ReactNode }) {
  const { locale } = useLocale();
  return <>{children(locale)}</>;
}
