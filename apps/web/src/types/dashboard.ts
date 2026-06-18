import type { ReactNode } from "react";

export type DashboardLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

export type DashboardPageProps = Readonly<{
  params: Promise<{
    locale: string;
  }>;
}>;
