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
  const [marketQuotesResult, freshnessResult, schedulerStatusResult] =
    await Promise.all([
      getMarketQuotes().then(toSuccess, toFailure),
      getMarketQuoteSnapshotFreshness().then(toSuccess, toFailure),
      getMarketDataSchedulerRunStatus().then(toSuccess, toFailure),
    ]);

  return (
    <div className="markets-page">
      <MarketsHeader messages={messages.markets.header} />
      <MarketDataStatus
        availability={{
          freshness: freshnessResult.ok,
          quotes: marketQuotesResult.ok,
          scheduler: schedulerStatusResult.ok,
        }}
        freshness={freshnessResult.ok ? freshnessResult.data : []}
        locale={locale}
        messages={messages.markets.dataStatus}
        schedulerStatus={
          schedulerStatusResult.ok ? schedulerStatusResult.data : null
        }
      />
      <MarketExplorer
        locale={locale}
        marketQuotes={marketQuotesResult.ok ? marketQuotesResult.data : []}
        messages={messages.markets}
      />
    </div>
  );
}

type LoadResult<Data> =
  | Readonly<{
      data: Data;
      ok: true;
    }>
  | Readonly<{
      ok: false;
    }>;

function toSuccess<Data>(data: Data): LoadResult<Data> {
  return {
    data,
    ok: true,
  };
}

function toFailure(): LoadResult<never> {
  return {
    ok: false,
  };
}
