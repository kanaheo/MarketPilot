import { BacktestSummary } from "@/components/backtests/backtest-summary";
import { BacktestTrades } from "@/components/backtests/backtest-trades";
import { BenchmarkComparison } from "@/components/backtests/benchmark-comparison";
import { EquityDrawdownChart } from "@/components/backtests/equity-drawdown-chart";
import type { BacktestResultsProps } from "@/types/backtests";

export function BacktestResults(props: BacktestResultsProps) {
  return (
    <section className="backtest-results">
      <BacktestSummary {...props} />
      <div className="backtest-results-grid">
        <EquityDrawdownChart {...props} />
        <BenchmarkComparison {...props} />
      </div>
      <BacktestTrades {...props} />
    </section>
  );
}
