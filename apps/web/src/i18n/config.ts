import { notFound } from "next/navigation";

import type { Locale } from "@/types/i18n";

export const locales = ["ko", "en", "ja"] as const satisfies readonly Locale[];
export const defaultLocale: Locale = "ko";

export const localeLabels: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
};

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function assertLocale(value: string): asserts value is Locale {
  if (!isLocale(value)) {
    notFound();
  }
}
