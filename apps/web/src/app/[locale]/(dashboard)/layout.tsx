import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppShell } from "@/components/layout/app-shell";
import { assertLocale } from "@/i18n/config";
import type { DashboardLayoutProps } from "@/types/dashboard";

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;

  assertLocale(locale);

  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  return (
    <AppShell
      locale={locale}
      user={{
        email: session.user.email ?? null,
        image: session.user.image ?? null,
        name: session.user.name ?? null,
      }}
    >
      {children}
    </AppShell>
  );
}
