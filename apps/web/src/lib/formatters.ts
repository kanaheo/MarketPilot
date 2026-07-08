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
  const dateParts = getUtcDateParts(value);
  if (dateParts === null) {
    return value;
  }

  if (locale === "en") {
    return `${dateParts.monthNameEn} ${dateParts.day}, ${dateParts.year}`;
  }

  return locale === "ko"
    ? `${dateParts.year}년 ${dateParts.month}월 ${dateParts.day}일`
    : `${dateParts.year}年${dateParts.month}月${dateParts.day}日`;
}

export function formatDateTime(value: string, locale: Locale) {
  const dateParts = getUtcDateParts(value);
  if (dateParts === null) {
    return value;
  }

  const time = `${dateParts.hour}:${dateParts.minute} UTC`;

  if (locale === "en") {
    return `${dateParts.monthNameEn} ${dateParts.day}, ${dateParts.year}, ${time}`;
  }

  return locale === "ko"
    ? `${dateParts.year}년 ${dateParts.month}월 ${dateParts.day}일 ${time}`
    : `${dateParts.year}年${dateParts.month}月${dateParts.day}日 ${time}`;
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

export function formatMarketPriceDelta(
  value: number,
  currency: "USD" | "KRW" | "JPY",
  locale: Locale,
) {
  return new Intl.NumberFormat(localeCodes[locale], {
    currency,
    maximumFractionDigits: currency === "USD" ? 2 : currency === "JPY" ? 1 : 0,
    minimumFractionDigits: currency === "USD" ? 2 : 0,
    signDisplay: "always",
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

function getUtcDateParts(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const month = date.getUTCMonth() + 1;

  return {
    day: date.getUTCDate(),
    hour: date.getUTCHours().toString().padStart(2, "0"),
    minute: date.getUTCMinutes().toString().padStart(2, "0"),
    month,
    monthNameEn: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][month - 1],
    year: date.getUTCFullYear(),
  };
}
