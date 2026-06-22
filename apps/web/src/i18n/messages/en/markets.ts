import type { Messages } from "@/types/i18n";

export const markets = {
  header: {
    eyebrow: "Global discovery",
    title: "Market Explorer",
    description: "Discover opportunities across the US, Korea, and Japan.",
    dataBadge: "Fixture universe · 3 markets",
  },
  filters: {
    ariaLabel: "Market search and filters",
    searchLabel: "Search symbols and companies",
    searchPlaceholder: "Search symbol or company",
    detailsLabel: "Refine results",
    reset: "Reset",
    resultsPrefix: "Showing",
    resultsSuffix: "instruments",
    fixtureNotice: "Fixture metadata · delayed prices will be connected later",
    groups: {
      country: "Market",
      assetClass: "Asset class",
      session: "Session",
      sector: "Sector",
      exchange: "Exchange",
      marketCap: "Market cap",
      change: "Price change",
      volume: "Volume",
    },
    options: {
      country: [
        { label: "All markets", value: "all" },
        { label: "United States", value: "us" },
        { label: "Korea", value: "kr" },
        { label: "Japan", value: "jp" },
      ],
      assetClass: [
        { label: "All assets", value: "all" },
        { label: "Stocks", value: "stocks" },
        { label: "ETFs", value: "etfs" },
      ],
      session: [
        { label: "Any session", value: "all" },
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" },
      ],
      sector: [
        { label: "All sectors", value: "all" },
        { label: "Technology", value: "technology" },
        { label: "Financials", value: "financials" },
        { label: "Industrials", value: "industrials" },
        { label: "Consumer", value: "consumer" },
        { label: "Healthcare", value: "healthcare" },
      ],
      exchange: [
        { label: "All exchanges", value: "all" },
        { label: "NASDAQ", value: "NASDAQ" },
        { label: "NYSE", value: "NYSE" },
        { label: "KOSPI", value: "KOSPI" },
        { label: "KOSDAQ", value: "KOSDAQ" },
        { label: "Tokyo Stock Exchange", value: "TSE" },
      ],
      marketCap: [
        { label: "Any market cap", value: "all" },
        { label: "Large cap", value: "large" },
        { label: "Mid cap", value: "mid" },
      ],
      change: [
        { label: "Any change", value: "all" },
        { label: "Gainers", value: "gainers" },
        { label: "Losers", value: "losers" },
        { label: "Mostly flat", value: "flat" },
      ],
      volume: [
        { label: "Any volume", value: "all" },
        { label: "Unusual volume", value: "high" },
        { label: "Normal volume", value: "normal" },
      ],
    },
    aiSignals: {
      title: "AI signals only",
      description: "Evidence-backed fixture analysis",
    },
  },
} as const satisfies Messages["markets"];
