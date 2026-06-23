import type { Messages } from "@/types/i18n";

export const portfolio = {
  header: {
    title: "Portfolio",
    description: "Track allocation, holdings, cash flow, and risk in one place.",
  },
  pageState: {
    empty: {
      title: "No portfolio yet",
      description:
        "Create your first paper portfolio to start recording cash activity.",
    },
  },
  summary: {
    label: "Portfolio summary",
    unavailable: "Not available yet",
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
  cashActivity: {
    title: "Cash activity",
    description: "Recent cash ledger activity",
    balance: "Available cash",
    items: {
      INITIAL_DEPOSIT: "Initial deposit",
      DEPOSIT: "Deposit",
      WITHDRAWAL: "Withdrawal",
      FEE: "Fee",
      DIVIDEND: "Dividend",
    },
    empty: {
      title: "No cash activity yet",
      description: "Deposits and paper purchases will appear here.",
    },
  },
  risk: {
    title: "Risk overview",
    description: "Current portfolio risk indicators",
    status: {
      good: "Good",
      moderate: "Moderate",
      measured: "Measured",
    },
    items: {
      diversification: {
        title: "Diversification",
        description: "Spread across stocks, ETFs, and cash",
      },
      concentration: {
        title: "Concentration",
        description: "Top three holdings represent 71%",
      },
      volatility: {
        title: "Volatility (1Y)",
        description: "Annualized portfolio volatility",
      },
    },
  },
} as const satisfies Messages["portfolio"];
