import type { Locale, Messages } from "@/types/i18n";

export type PortfolioPageProps = Readonly<{
  params: Promise<{
    locale: string;
  }>;
}>;

export type PortfolioMessages = Messages["portfolio"];

export type PortfolioHeaderProps = Readonly<{
  messages: PortfolioMessages["header"];
}>;

export type PortfolioSummaryProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["summary"];
}>;
