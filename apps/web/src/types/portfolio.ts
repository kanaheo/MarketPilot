import type { Locale } from "@/types/i18n";
import type { PortfolioMessages } from "@/types/i18n/portfolio";
import type {
  CashTransactionType,
  SupportedCurrency,
} from "@/types/marketpilot-api";

export type PortfolioPageProps = Readonly<{
  params: Promise<{
    locale: string;
  }>;
}>;

export type PortfolioHeaderProps = Readonly<{
  messages: PortfolioMessages["header"];
  portfolioName?: string;
}>;

export type PortfolioSummaryProps = Readonly<{
  currency: SupportedCurrency;
  currentCash: number;
  locale: Locale;
  messages: PortfolioMessages["summary"];
}>;

export type PortfolioValueChartProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["valueChart"];
}>;

export type AssetAllocationProps = Readonly<{
  currency: SupportedCurrency;
  currentCash: number;
  locale: Locale;
  messages: PortfolioMessages["allocation"];
}>;

export type PortfolioHoldingsProps = Readonly<{
  holdings: readonly PortfolioHolding[];
  locale: Locale;
  messages: PortfolioMessages["holdings"];
}>;

export type CashActivityProps = Readonly<{
  activities: readonly PortfolioCashActivity[];
  locale: Locale;
  messages: PortfolioMessages["cashActivity"];
}>;

export type RiskOverviewProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["risk"];
}>;

export type PortfolioHolding = Readonly<{
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  returnRate: number;
  color: string;
}>;

export type PortfolioCashActivity = Readonly<{
  id: string;
  type: CashTransactionType;
  occurredAt: string;
  amount: number;
  balance: number;
  currency: SupportedCurrency;
  note: string | null;
}>;
