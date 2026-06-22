import {
  Activity,
  ChartNoAxesCombined,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";

import { SummaryCard } from "@/components/common/summary-card";
import { formatPercent } from "@/lib/formatters";
import type { BacktestResultsProps } from "@/types/backtests";

export function BacktestSummary({
  locale,
  messages,
  result,
}: BacktestResultsProps) {
  return (
    <section className="backtest-summary-grid" aria-label={messages.summary.title}>
      <SummaryCard
        detail={`${messages.summary.benchmark} ${formatPercent(result.benchmarkReturn, locale)}`}
        detailAside={messages.summary.fixture}
        icon={TrendingUp}
        label={messages.summary.totalReturn}
        tone="positive"
        value={formatPercent(result.totalReturn, locale)}
      />
      <SummaryCard
        detail={`${messages.summary.excessReturn} ${formatPercent(result.excessReturn, locale)}`}
        icon={ChartNoAxesCombined}
        label={messages.summary.annualizedReturn}
        tone="positive"
        value={formatPercent(result.annualizedReturn, locale)}
      />
      <SummaryCard
        detail={messages.summary.riskDetail}
        icon={ShieldAlert}
        label={messages.summary.maxDrawdown}
        tone="negative"
        value={formatPercent(result.maxDrawdown, locale)}
      />
      <SummaryCard
        detail={`${messages.summary.winRate} ${formatPercent(result.winRate, locale)}`}
        detailAside={`${result.tradeCount}${messages.summary.trades}`}
        icon={Activity}
        label={messages.summary.sharpeRatio}
        tone="neutral"
        value={result.sharpeRatio.toFixed(2)}
      />
    </section>
  );
}
