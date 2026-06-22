import type { Messages } from "@/types/i18n";

export type MarketCountry = "all" | "us" | "kr" | "jp";
export type MarketAssetClass = "all" | "stocks" | "etfs";
export type MarketSession = "all" | "open" | "closed";

export type MarketInstrument = Readonly<{
  symbol: string;
  name: string;
  country: Exclude<MarketCountry, "all">;
  assetClass: Exclude<MarketAssetClass, "all">;
  session: Exclude<MarketSession, "all">;
  exchange: "NASDAQ" | "NYSE" | "KOSPI" | "KOSDAQ" | "TSE";
  sector:
    | "technology"
    | "financials"
    | "industrials"
    | "consumer"
    | "healthcare";
  marketCap: "large" | "mid";
  changeBand: "gainers" | "losers" | "flat";
  volumeBand: "high" | "normal";
  hasAiSignal: boolean;
}>;

export type MarketsMessages = Messages["markets"];

export type MarketsPageProps = Readonly<{
  params: Promise<{
    locale: string;
  }>;
}>;

export type MarketsHeaderProps = Readonly<{
  messages: MarketsMessages["header"];
}>;

export type MarketFiltersProps = Readonly<{
  messages: MarketsMessages["filters"];
}>;
