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
} as const satisfies Messages["portfolio"];
