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

export type PortfolioValueChartProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["valueChart"];
}>;

export type AssetAllocationProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["allocation"];
}>;

export type PortfolioHoldingsProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["holdings"];
}>;
