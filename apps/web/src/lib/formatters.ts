import type { Locale } from "@/types/i18n";

const localeCodes: Record<Locale, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
};

export function formatCurrency(
  value: number,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat(localeCodes[locale], {
    currency: "KRW",
    maximumFractionDigits: 0,
    style: "currency",
    ...options,
  }).format(value);
}

export function formatDollar(value: number, locale: Locale) {
  return new Intl.NumberFormat(localeCodes[locale], {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

export function formatPercent(
  value: number,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat(localeCodes[locale], {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: "exceptZero",
    style: "percent",
    ...options,
  }).format(value);
}
