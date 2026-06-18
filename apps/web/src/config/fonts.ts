import { Inter, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";

import type { Locale } from "@/types/i18n";

const koreanFont = Noto_Sans_KR({
  display: "swap",
  fallback: ["Apple SD Gothic Neo", "Malgun Gothic", "sans-serif"],
  preload: false,
  variable: "--font-app",
  weight: "variable",
});

const englishFont = Inter({
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  subsets: ["latin"],
  variable: "--font-app",
});

const japaneseFont = Noto_Sans_JP({
  display: "swap",
  fallback: ["Hiragino Sans", "Yu Gothic", "sans-serif"],
  preload: false,
  variable: "--font-app",
  weight: "variable",
});

export const localeFontClassNames: Record<Locale, string> = {
  ko: koreanFont.variable,
  en: englishFont.variable,
  ja: japaneseFont.variable,
};
