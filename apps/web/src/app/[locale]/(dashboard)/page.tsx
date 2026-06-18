import { AccountActivity } from "@/components/dashboard/account-activity";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { Holdings } from "@/components/dashboard/holdings";
import { MarketSignals } from "@/components/dashboard/market-signals";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { Watchlist } from "@/components/dashboard/watchlist";
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
      <DashboardSummary locale={locale} messages={messages.dashboard.summary} />
      <div className="dashboard-primary-grid">
        <PerformanceChart
          locale={locale}
          messages={messages.dashboard.performance}
        />
        <Watchlist locale={locale} messages={messages.dashboard.watchlist} />
      </div>
      <div className="dashboard-secondary-grid">
        <MarketSignals
          locale={locale}
          messages={messages.dashboard.signals}
        />
        <Holdings locale={locale} messages={messages.dashboard.holdings} />
        <AccountActivity
          locale={locale}
          messages={messages.dashboard.activity}
        />
      </div>
    </div>
  );
}
