import { BacktestSummary } from "@/components/backtests/backtest-summary";
import { BacktestTrades } from "@/components/backtests/backtest-trades";
import { BenchmarkComparison } from "@/components/backtests/benchmark-comparison";
import { EquityDrawdownChart } from "@/components/backtests/equity-drawdown-chart";
import { formatPercent } from "@/lib/formatters";
import type { BacktestResultsProps } from "@/types/backtests";

export function BacktestResults({
  locale,
  messages,
  result,
}: BacktestResultsProps) {
  const assumptions = result.assumptions;
  const diagnostics = result.diagnostics;

  return (
    <section className="backtest-results">
      <BacktestSummary
        locale={locale}
        messages={messages}
        result={result}
      />
      <section
        className="backtest-assumptions-strip"
        aria-label={messages.assumptions.title}
      >
        <header>
          <strong>{messages.assumptions.title}</strong>
          <span>{messages.assumptions.description}</span>
        </header>
        <dl>
          <div>
            <dt>{messages.risk.fields.stopLoss}</dt>
            <dd>{formatPercent(assumptions.stopLoss / 100, locale)}</dd>
          </div>
          <div>
            <dt>{messages.risk.fields.rebalanceFrequency}</dt>
            <dd>
              {
                messages.risk.options.rebalanceFrequencies.find(
                  (option) =>
                    option.value === assumptions.rebalanceFrequency,
                )?.label
              }
            </dd>
          </div>
          <div>
            <dt>{messages.risk.fields.feeRate}</dt>
            <dd>{formatPercent(assumptions.feeRate / 100, locale)}</dd>
          </div>
          <div>
            <dt>{messages.risk.fields.slippageRate}</dt>
            <dd>{formatPercent(assumptions.slippageRate / 100, locale)}</dd>
          </div>
          <div>
            <dt>{messages.risk.fields.executionTiming}</dt>
            <dd>
              {
                messages.risk.options.executionTimings.find(
                  (option) => option.value === assumptions.executionTiming,
                )?.label
              }
            </dd>
          </div>
          <div>
            <dt>{messages.risk.fields.cashReserve}</dt>
            <dd>{formatPercent(assumptions.cashReserve / 100, locale)}</dd>
          </div>
        </dl>
        <div className="backtest-assumptions-detail-grid">
          <section>
            <strong>{messages.assumptions.allocations}</strong>
            <div className="backtest-allocation-chips">
              {result.allocations.map((allocation) => (
                <span key={allocation.symbol}>
                  {allocation.symbol}
                  <b>{formatPercent(allocation.weight / 100, locale)}</b>
                </span>
              ))}
            </div>
          </section>
          <section>
            <strong>{messages.assumptions.diagnostics}</strong>
            <dl className="backtest-diagnostics-list">
              <div>
                <dt>{messages.assumptions.annualCostDrag}</dt>
                <dd>
                  {formatPercent(diagnostics.annualCostDrag, locale)}
                </dd>
              </div>
              <div>
                <dt>{messages.assumptions.stopLossHits}</dt>
                <dd>
                  {diagnostics.stopLossHitCount}
                  {messages.assumptions.hitSuffix}
                </dd>
              </div>
              <div>
                <dt>{messages.assumptions.bestCheckpoint}</dt>
                <dd>
                  {formatPercent(
                    diagnostics.bestCheckpointReturn,
                    locale,
                  )}
                </dd>
              </div>
              <div>
                <dt>{messages.assumptions.worstCheckpoint}</dt>
                <dd>
                  {formatPercent(
                    diagnostics.worstCheckpointReturn,
                    locale,
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </section>
      <div className="backtest-results-grid">
        <EquityDrawdownChart
          locale={locale}
          messages={messages}
          result={result}
        />
        <BenchmarkComparison
          locale={locale}
          messages={messages}
          result={result}
        />
      </div>
      <BacktestTrades
        locale={locale}
        messages={messages}
        result={result}
      />
    </section>
  );
}
