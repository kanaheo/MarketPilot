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

export function formatCompactDollar(value: number, locale: Locale) {
  return new Intl.NumberFormat(localeCodes[locale], {
    compactDisplay: "short",
    currency: "USD",
    maximumFractionDigits: 0,
    notation: "compact",
    style: "currency",
  }).format(value);
}

export function formatShortDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(localeCodes[locale], {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function formatMarketPrice(
  value: number,
  currency: "USD" | "KRW" | "JPY",
  locale: Locale,
) {
  return new Intl.NumberFormat(localeCodes[locale], {
    currency,
    maximumFractionDigits: currency === "USD" ? 2 : currency === "JPY" ? 1 : 0,
    minimumFractionDigits: currency === "USD" ? 2 : 0,
    style: "currency",
  }).format(value);
}

export function formatCompactNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(localeCodes[locale], {
    maximumFractionDigits: 1,
    notation: "compact",
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
