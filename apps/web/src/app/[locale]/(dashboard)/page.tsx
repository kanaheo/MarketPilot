import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { assertLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import type { DashboardPageProps } from "@/types/dashboard";

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;

  assertLocale(locale);

  const messages = getMessages(locale);

  return (
    <div className="dashboard-page">
      <DashboardHeader messages={messages.dashboard.header} />
      <DashboardSummary messages={messages.dashboard.summary} />
    </div>
  );
}
