import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { Locale } from "@/types/i18n";

export type ChildrenProps = Readonly<{
  children: ReactNode;
}>;

export type AppShellProps = Readonly<{
  children: ReactNode;
  locale: Locale;
}>;

export type SidebarProps = Readonly<{
  locale: Locale;
}>;

export type TopBarProps = Readonly<{
  locale: Locale;
}>;

export type PanelProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export type SectionHeaderProps = Readonly<{
  actionLabel?: string;
  description?: string;
  icon?: LucideIcon;
  meta?: string;
  title: string;
}>;

export type TrendValueProps = Readonly<{
  children: ReactNode;
  value: number;
}>;

export type AssetMarkProps = Readonly<{
  color: string;
  symbol: string;
}>;
