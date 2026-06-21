import type { Messages } from "@/types/i18n";

export const portfolio = {
  header: {
    title: "Portfolio",
    description: "Track allocation, holdings, cash flow, and risk in one place.",
  },
  summary: {
    label: "Portfolio summary",
    cards: {
      totalValue: "Total value",
      availableCash: "Available cash",
      totalReturn: "Total return",
      maxDrawdown: "Max drawdown",
    },
  },
  valueChart: {
    title: "Portfolio value",
    chartLabel: "Portfolio value and S&P 500 comparison chart",
    portfolio: "Your portfolio",
    benchmark: "S&P 500",
    periodLabel: "Portfolio value period",
    periods: [
      { label: "1M", active: true },
      { label: "3M", active: false },
      { label: "6M", active: false },
      { label: "1Y", active: false },
    ],
  },
  allocation: {
    title: "Asset allocation",
    chartLabel: "Asset allocation donut chart",
    totalValue: "Total value",
    items: {
      stocks: "Stocks",
      etfs: "ETFs",
      cash: "Cash",
    },
  },
  holdings: {
    title: "Holdings",
    description: "Current paper positions · cash excluded",
    shareUnit: " sh",
    columns: {
      asset: "Asset",
      quantity: "Quantity",
      averagePrice: "Average price",
      currentPrice: "Current price",
      marketValue: "Market value",
      returnRate: "Return",
    },
    empty: {
      title: "No holdings yet",
      description:
        "Your positions will appear here after your first paper order is filled.",
    },
  },
} as const satisfies Messages["portfolio"];
