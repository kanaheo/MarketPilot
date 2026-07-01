import { MarketExplorer } from "@/components/markets/market-explorer";
import { MarketsHeader } from "@/components/markets/markets-header";
import { assertLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { getMarketQuotes } from "@/lib/server/portfolio-api";
import type { MarketsPageProps } from "@/types/markets";

export default async function MarketsPage({ params }: MarketsPageProps) {
  const { locale } = await params;

  assertLocale(locale);

  const messages = getMessages(locale);
  const marketQuotes = await getMarketQuotes().catch(() => []);

  return (
    <div className="markets-page">
      <MarketsHeader messages={messages.markets.header} />
      <MarketExplorer
        locale={locale}
        marketQuotes={marketQuotes}
        messages={messages.markets}
      />
    </div>
  );
}
