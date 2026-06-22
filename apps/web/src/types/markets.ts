import type { Locale, Messages } from "@/types/i18n";

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
  currency: "USD" | "KRW" | "JPY";
  price: number;
  changeRate: number;
  volume: number;
  aiScore: number | null;
  color: string;
  sparkline: readonly number[];
}>;

export type MarketFilterState = Readonly<{
  query: string;
  country: MarketCountry;
  assetClass: MarketAssetClass;
  session: MarketSession;
  sector: string;
  exchange: string;
  marketCap: string;
  changeBand: string;
  volumeBand: string;
  aiSignalsOnly: boolean;
}>;

export type MarketSort = "aiScore" | "changeRate" | "name" | "volume";

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
  state: MarketFilterState;
  resultCount: number;
  onChange: <Key extends keyof MarketFilterState>(
    key: Key,
    value: MarketFilterState[Key],
  ) => void;
  onReset: () => void;
}>;

export type MarketExplorerProps = Readonly<{
  locale: Locale;
  messages: MarketsMessages;
}>;

export type AiDiscoveryProps = Readonly<{
  instruments: readonly MarketInstrument[];
  messages: MarketsMessages["discovery"];
}>;

export type MarketTableProps = Readonly<{
  instruments: readonly MarketInstrument[];
  locale: Locale;
  messages: MarketsMessages["table"];
  sort: MarketSort;
  watchlist: ReadonlySet<string>;
  onSortChange: (sort: MarketSort) => void;
  onToggleWatchlist: (symbol: string) => void;
}>;
