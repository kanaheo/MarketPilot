import type { Locale, Messages } from "@/types/i18n";

export type NavigationKey =
  | "dashboard"
  | "portfolio"
  | "markets"
  | "backtests"
  | "data";

export type NavigationIconKey = NavigationKey;

export type NavigationItem = Readonly<{
  key: NavigationKey;
  href: string;
  icon: NavigationIconKey;
}>;

export type NavigationMessages = Messages["navigation"]["items"];

export type PrimaryNavigationProps = Readonly<{
  ariaLabel: string;
  labels: NavigationMessages;
  locale: Locale;
}>;
