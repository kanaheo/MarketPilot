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
    fallbackName: "MarketPilot user",
    role: "Paper investor",
    signOut: "Sign out",
  },
  feedback: {
    loading: "Loading your dashboard.",
    retry: "Try again",
    errorTitle: "We couldn't load your dashboard",
    errorDescription:
      "Please try again in a moment. If the problem continues, check your network connection.",
  },
} as const satisfies Omit<
  Messages,
  "auth" | "backtests" | "dashboard" | "markets" | "portfolio"
>;
