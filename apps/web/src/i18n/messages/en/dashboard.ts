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
        value: "₩15,873,420",
        detail: "↗ +8.73%",
        detailAside: "Investment gain +₩873,420",
      },
      availableCash: {
        label: "Available cash",
        value: "₩3,214,800",
        detail: "Cash allocation 20.3%",
        detailAside: "Recent deposit +₩5,000,000",
      },
      todayProfit: {
        label: "Today's P&L",
        value: "+₩184,260",
        detail: "↗ +1.18%",
        detailAside: "vs. S&P 500 +0.62%",
      },
      maxDrawdown: {
        label: "Maximum drawdown",
        value: "-4.82%",
        detail: "48% of risk budget",
        detailAside: "Limit -10%",
      },
    },
  },
} as const satisfies Messages["dashboard"];
