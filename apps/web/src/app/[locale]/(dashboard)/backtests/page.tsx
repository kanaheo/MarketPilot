import { BacktestSetup } from "@/components/backtests/backtest-setup";
import { BacktestsHeader } from "@/components/backtests/backtests-header";
import { assertLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import type { BacktestsPageProps } from "@/types/backtests";

export default async function BacktestsPage({ params }: BacktestsPageProps) {
  const { locale } = await params;

  assertLocale(locale);

  const messages = getMessages(locale);

  return (
    <div className="backtests-page">
      <BacktestsHeader messages={messages.backtests.header} />
      <BacktestSetup messages={messages.backtests} />
    </div>
  );
}
