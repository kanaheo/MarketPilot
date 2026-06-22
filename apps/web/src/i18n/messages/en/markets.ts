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
  discovery: {
    title: "AI Discovery",
    description: "Evidence-aware ideas across the selected market universe",
    updated: "Fixture analysis · Updated 10m ago",
    evidence: "Why it stands out",
    counterRisk: "What could go wrong",
    fixtureLabel: "Fixture signal · Not connected to live prices",
    disclaimer:
      "Signals are not investment advice. Review the evidence, counter-risk, and data timestamp before making a paper-trading decision.",
    countries: {
      us: "United States",
      kr: "Korea",
      jp: "Japan",
    },
    risks: {
      low: "Low risk",
      medium: "Medium risk",
    },
    items: {
      nvda: {
        signal: "Momentum strengthening",
        evidence: "Relative strength and unusual volume are improving together.",
        counterRisk: "The recent rally leaves less room for valuation mistakes.",
      },
      samsung: {
        signal: "Rebound setup forming",
        evidence: "Semiconductor demand expectations and volume are recovering.",
        counterRisk: "Memory pricing and foreign flows remain highly cyclical.",
      },
      toyota: {
        signal: "Defensive strength",
        evidence: "Stable cash generation and a weaker yen support resilience.",
        counterRisk: "Currency reversal and supply costs could reduce margins.",
      },
    },
    empty: {
      title: "No AI signals match these filters",
      description:
        "Broaden the market or detailed filters to review more fixture signals.",
    },
  },
  table: {
    title: "Market universe",
    resultsPrefix: "Showing",
    resultsSuffix: "instruments",
    sortLabel: "Sort by",
    sortOptions: [
      { label: "AI score", value: "aiScore" },
      { label: "Price change", value: "changeRate" },
      { label: "Volume", value: "volume" },
      { label: "Company name", value: "name" },
    ],
    columns: {
      company: "Company",
      market: "Market",
      price: "Price",
      change: "Change",
      volume: "Volume",
      trend: "Trend",
      aiScore: "AI score",
      watchlist: "Watch",
    },
    countries: {
      us: "US",
      kr: "Korea",
      jp: "Japan",
    },
    sessions: {
      open: "Open",
      closed: "Closed",
    },
    noSignal: "—",
    addWatchlist: "add to watchlist",
    removeWatchlist: "remove from watchlist",
    empty: {
      title: "No instruments match these filters",
      description:
        "Reset one or more conditions, or try a different symbol or company name.",
    },
  },
} as const satisfies Messages["markets"];
