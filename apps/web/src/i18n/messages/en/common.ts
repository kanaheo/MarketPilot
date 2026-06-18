import type { Messages } from "@/types/i18n";

export const common = {
  navigation: {
    ariaLabel: "Primary navigation",
    items: {
      dashboard: "Dashboard",
      portfolio: "Portfolio",
      markets: "Market Explorer",
      backtests: "Backtests",
      data: "Data",
    },
    settings: "Settings",
  },
  topBar: {
    marketOpen: "US market is open",
    marketCloseTime: "Closes in 3h 24m",
    notifications: "Notifications",
    portfolio: "Growth portfolio",
  },
  languageSelector: {
    label: "Select language",
  },
  user: {
    role: "Paper investor",
  },
} as const satisfies Omit<Messages, "dashboard">;
