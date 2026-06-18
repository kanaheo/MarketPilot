import type { ReactNode } from "react";

import type { Messages } from "@/types/i18n";

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
