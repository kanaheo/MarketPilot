import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { Locale } from "@/types/i18n";

export type ChildrenProps = Readonly<{
  children: ReactNode;
}>;

export type AppShellProps = Readonly<{
  children: ReactNode;
  locale: Locale;
  user: AuthenticatedUser;
}>;

export type SidebarProps = Readonly<{
  locale: Locale;
  user: AuthenticatedUser;
}>;

export type AuthenticatedUser = Readonly<{
  email: string | null;
  image: string | null;
  name: string | null;
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

export type EmptyStateProps = Readonly<{
  actionLabel?: string;
  description: string;
  icon?: LucideIcon;
  title: string;
}>;

export type ErrorStateProps = Readonly<{
  actionLabel: string;
  description: string;
  onRetry: () => void;
  title: string;
}>;

export type LoadingSkeletonProps = Readonly<{
  className?: string;
  height: number | string;
  width?: number | string;
}>;
