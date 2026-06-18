import type { Messages } from "@/types/i18n";

export const dashboard = {
  header: {
    greeting: "Good morning, Gyeongmin",
    description:
      "Markets are volatile today. Review both your rationale and risk.",
    actions: {
      history: "Transaction history",
      addFunds: "Add virtual funds",
    },
  },
  summary: {
    summaryLabel: "Portfolio highlights",
    cards: {
      totalValue: {
        label: "Total value",
        detail: "Investment gain",
      },
      availableCash: {
        label: "Available cash",
        detail: "Cash allocation",
        detailAside: "Recent deposit",
      },
      todayProfit: {
        label: "Today's P&L",
        detail: "vs. S&P 500",
      },
      maxDrawdown: {
        label: "Maximum drawdown",
        detail: "Risk budget used",
        detailAside: "Limit",
      },
    },
  },
  performance: {
    title: "Portfolio performance",
    description: "Time-weighted return excluding cash flows",
    chartLabel: "Portfolio and S&P 500 performance comparison chart",
    portfolio: "My portfolio",
    benchmark: "S&P 500",
    periodLabel: "Performance period",
    empty: {
      title: "No performance data yet",
      description:
        "Your portfolio performance will appear after the first transaction is recorded.",
    },
    periods: [
      { label: "1W", active: false },
      { label: "1M", active: true },
      { label: "3M", active: false },
      { label: "1Y", active: false },
    ],
  },
  watchlist: {
    title: "Watchlist",
    updated: "Updated 10s ago",
    realtime: "Fixture prices",
    manage: "Manage watchlist",
    empty: {
      title: "Your watchlist is empty",
      description:
        "Add symbols to quickly track their prices and daily changes.",
      action: "Add symbols",
    },
    columns: {
      symbol: "Symbol",
      price: "Price",
      change: "Change",
      trend: "Trend (1D)",
    },
  },
  signals: {
    title: "AI market signals",
    description: "Analysis as of 09:30 today",
    viewAll: "View all",
    probability: "Upside chance",
    disclaimer:
      "Signals are not investment advice. Review historical model performance and current risks together.",
    empty: {
      title: "No signals to display",
      description:
        "New signals will appear here after the next market analysis is complete.",
    },
    risks: {
      low: "Low risk",
      medium: "Medium risk",
      high: "High risk",
    },
    items: {
      amd: {
        title: "Bullish watch",
        description: "Improving AI chip demand and earnings momentum",
      },
      xle: {
        title: "Interest rising",
        description: "Geopolitical risk and expanding oil volatility",
      },
      tlt: {
        title: "Shift to neutral",
        description: "Slower US employment and changing rate expectations",
      },
    },
  },
  holdings: {
    title: "Holdings",
    description: "3 current positions · cash excluded",
    viewPortfolio: "View portfolio",
    viewAll: "View all holdings",
    shareUnit: " sh",
    empty: {
      title: "No holdings yet",
      description:
        "Your positions will appear here after your first paper order is filled.",
      action: "Explore markets",
    },
    columns: {
      symbol: "Symbol",
      quantity: "Quantity",
      value: "Value",
      returnRate: "Return",
    },
  },
  activity: {
    title: "Account activity",
    description: "Recent cash flows and orders",
    more: "Account activity menu",
    viewAll: "View all transactions",
    empty: {
      title: "No account activity yet",
      description: "Deposits, withdrawals, and paper orders will appear here.",
    },
    items: {
      deposit: {
        title: "Additional deposit",
        detail: "Virtual funds",
      },
      nvdaBuy: {
        title: "Bought NVDA",
        detail: "4 shares · $1,742.40",
      },
      amdSell: {
        title: "Sold AMD",
        detail: "2 shares · $165.80",
      },
    },
  },
} as const satisfies Messages["dashboard"];
