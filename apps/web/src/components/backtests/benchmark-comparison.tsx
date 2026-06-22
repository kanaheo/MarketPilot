import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { formatMarketPrice, formatPercent } from "@/lib/formatters";
import type { BacktestResultsProps } from "@/types/backtests";

export function BenchmarkComparison({
  locale,
  messages,
  result,
}: BacktestResultsProps) {
  const comparisonItems = [
    {
      key: "strategy",
      label: messages.comparison.strategy,
      value: result.totalReturn,
      tone: "strategy",
    },
    {
      key: "benchmark",
      label: messages.comparison.benchmark,
      value: result.benchmarkReturn,
      tone: "benchmark",
    },
  ] as const;
  const maxValue = Math.max(...comparisonItems.map((item) => item.value), 0.01);

  return (
    <Panel className="backtest-comparison-panel">
      <SectionHeader
        description={messages.comparison.description}
        title={messages.comparison.title}
      />

      <div className="backtest-comparison-bars">
        {comparisonItems.map((item) => (
          <div key={item.key}>
            <header>
              <span>{item.label}</span>
              <strong>{formatPercent(item.value, locale)}</strong>
            </header>
            <div className="backtest-comparison-track">
              <span
                className={item.tone}
                style={{ width: `${Math.max(6, (item.value / maxValue) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <dl className="backtest-comparison-details">
        <div>
          <dt>{messages.comparison.finalValue}</dt>
          <dd>
            {formatMarketPrice(result.finalValue, result.currency, locale)}
          </dd>
        </div>
        <div>
          <dt>{messages.comparison.excessReturn}</dt>
          <dd className="positive">
            {formatPercent(result.excessReturn, locale)}
          </dd>
        </div>
        <div>
          <dt>{messages.comparison.winRate}</dt>
          <dd>{formatPercent(result.winRate, locale)}</dd>
        </div>
        <div>
          <dt>{messages.comparison.trades}</dt>
          <dd>{result.tradeCount}</dd>
        </div>
      </dl>

      <p className="backtest-comparison-note">{messages.comparison.note}</p>
    </Panel>
  );
}
