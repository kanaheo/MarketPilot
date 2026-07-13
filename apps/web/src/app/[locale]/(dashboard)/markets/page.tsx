import { MarketExplorer } from "@/components/markets/market-explorer";
import { MarketDataStatus } from "@/components/markets/market-data-status";
import { MarketsHeader } from "@/components/markets/markets-header";
import { assertLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import {
  getMarketDataSchedulerRunStatus,
  getMarketQuoteSnapshotFreshness,
  getMarketQuotes,
} from "@/lib/server/portfolio-api";
import type { MarketsPageProps } from "@/types/markets";

export default async function MarketsPage({ params }: MarketsPageProps) {
  const { locale } = await params;

  assertLocale(locale);

  const messages = getMessages(locale);
  const [marketQuotes, freshness, schedulerStatus] = await Promise.all([
    getMarketQuotes().catch(() => []),
    getMarketQuoteSnapshotFreshness().catch(() => []),
    getMarketDataSchedulerRunStatus().catch(() => null),
  ]);

  return (
    <div className="markets-page">
      <MarketsHeader messages={messages.markets.header} />
      <MarketDataStatus
        freshness={freshness}
        locale={locale}
        messages={messages.markets.dataStatus}
        schedulerStatus={schedulerStatus}
      />
      <MarketExplorer
        locale={locale}
        marketQuotes={marketQuotes}
        messages={messages.markets}
      />
    </div>
  );
}
