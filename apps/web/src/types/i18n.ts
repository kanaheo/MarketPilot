import type { ReactNode } from "react";

export type Locale = "ko" | "en" | "ja";

export type LocaleLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

export type LanguageSelectorProps = Readonly<{
  ariaLabel: string;
  locale: Locale;
}>;

export type Messages = Readonly<{
  navigation: {
    ariaLabel: string;
    items: {
      dashboard: string;
      portfolio: string;
      markets: string;
      backtests: string;
      data: string;
    };
    settings: string;
  };
  topBar: {
    marketOpen: string;
    marketCloseTime: string;
    notifications: string;
    portfolio: string;
  };
  languageSelector: {
    label: string;
  };
  user: {
    role: string;
  };
  dashboard: {
    phase: string;
    title: string;
    placeholder: string;
  };
}>;
