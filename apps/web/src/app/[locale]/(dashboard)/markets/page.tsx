import { MarketExplorer } from "@/components/markets/market-explorer";
import { MarketsHeader } from "@/components/markets/markets-header";
import { assertLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import type { MarketsPageProps } from "@/types/markets";

export default async function MarketsPage({ params }: MarketsPageProps) {
  const { locale } = await params;

  assertLocale(locale);

  const messages = getMessages(locale);

  return (
    <div className="markets-page">
      <MarketsHeader messages={messages.markets.header} />
      <MarketExplorer locale={locale} messages={messages.markets} />
    </div>
  );
}
