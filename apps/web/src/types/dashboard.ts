import type { ReactNode } from "react";

import type { Messages } from "@/types/i18n";
import type { Locale } from "@/types/i18n";

export type DashboardLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

export type DashboardMessages = Messages["dashboard"];

export type DashboardHeaderProps = Readonly<{
  messages: DashboardMessages["header"];
}>;

export type DashboardSummaryProps = Readonly<{
  locale: Locale;
  messages: DashboardMessages["summary"];
}>;

export type SummaryCardProps = Readonly<{
  label: string;
  value: string;
  detail: string;
  detailAside?: string;
  tone: "positive" | "neutral" | "warning";
}>;

export type DashboardPageProps = Readonly<{
  params: Promise<{
    locale: string;
  }>;
}>;

type LocalizedDashboardSectionProps<Key extends keyof DashboardMessages> =
  Readonly<{
    locale: Locale;
    messages: DashboardMessages[Key];
  }>;

export type PerformanceChartProps =
  LocalizedDashboardSectionProps<"performance">;
export type WatchlistProps = LocalizedDashboardSectionProps<"watchlist">;
export type MarketSignalsProps = LocalizedDashboardSectionProps<"signals">;
export type HoldingsProps = LocalizedDashboardSectionProps<"holdings">;
export type AccountActivityProps = LocalizedDashboardSectionProps<"activity">;
