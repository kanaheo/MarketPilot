import { AppShell } from "@/components/layout/app-shell";
import { assertLocale } from "@/i18n/config";
import type { DashboardLayoutProps } from "@/types/dashboard";

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;

  assertLocale(locale);

  return <AppShell locale={locale}>{children}</AppShell>;
}
