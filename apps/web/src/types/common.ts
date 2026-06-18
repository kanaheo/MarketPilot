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
