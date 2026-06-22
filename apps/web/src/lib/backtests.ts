import { backtestAssets } from "@/data/backtests";
import type {
  BacktestAsset,
  BacktestBenchmark,
  BacktestFormValues,
  BacktestResult,
  BacktestStrategy,
  SelectedBacktestAsset,
} from "@/types/backtests";

const strategyReturnFactor: Record<BacktestStrategy, number> = {
  momentum: 1.12,
  movingAverage: 0.88,
  buyAndHold: 1,
};

const strategyRiskFactor: Record<BacktestStrategy, number> = {
  momentum: 1.08,
  movingAverage: 0.72,
  buyAndHold: 1,
};

const benchmarkAnnualReturn: Record<BacktestBenchmark, number> = {
  SPY: 0.121,
  KOSPI: 0.052,
  NIKKEI225: 0.108,
};

export function getBacktestAsset(symbol: string) {
  return backtestAssets.find((asset) => asset.symbol === symbol);
}

function getYears(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();

  return Math.max((end - start) / (365.25 * 24 * 60 * 60 * 1000), 1 / 12);
}

function getWeightedMetric(
  selectedAssets: readonly SelectedBacktestAsset[],
  metric: keyof Pick<BacktestAsset, "annualReturn" | "volatility">,
) {
  return selectedAssets.reduce((total, selectedAsset) => {
    const asset = getBacktestAsset(selectedAsset.symbol);
    return total + (asset?.[metric] ?? 0) * (selectedAsset.weight / 100);
  }, 0);
}

function createChart(
  values: BacktestFormValues,
  totalReturn: number,
  benchmarkReturn: number,
  volatility: number,
) {
  const points = 13;
  let peak = values.initialCapital;

  return Array.from({ length: points }, (_, index) => {
    const progress = index / (points - 1);
    const seasonalMove =
      Math.sin(index * 1.37) * volatility * 0.055 * (0.35 + progress);
    const correction =
      index === 5
        ? -0.32 - volatility * 0.08
        : index === 9
          ? -0.18 - volatility * 0.05
          : 0;
    const portfolio =
      values.initialCapital *
      Math.max(0.2, 1 + totalReturn * progress + seasonalMove + correction);
    const benchmark =
      values.initialCapital *
      (1 +
        benchmarkReturn * progress +
        Math.sin(index * 0.92) * 0.018 * progress);

    peak = Math.max(peak, portfolio);

    const date = new Date(`${values.startDate}T00:00:00Z`);
    const end = new Date(`${values.endDate}T00:00:00Z`);
    date.setUTCDate(
      date.getUTCDate() +
        Math.round(
          ((end.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)) *
            progress,
        ),
    );

    return {
      date: date.toISOString().slice(0, 10),
      portfolio: Math.round(portfolio),
      benchmark: Math.round(benchmark),
      drawdown: portfolio / peak - 1,
    };
  });
}

function createTrades(
  values: BacktestFormValues,
  selectedAssets: readonly SelectedBacktestAsset[],
  totalReturn: number,
) {
  const start = new Date(`${values.startDate}T00:00:00Z`);
  const end = new Date(`${values.endDate}T00:00:00Z`);
  const duration = end.getTime() - start.getTime();

  return selectedAssets.flatMap((selectedAsset, assetIndex) => {
    const entryPrice = 80 + (assetIndex + 1) * 37.25;
    const quantity = Math.max(
      1,
      Math.floor(
        (values.initialCapital * (selectedAsset.weight / 100)) / entryPrice,
      ),
    );
    const exitPrice =
      entryPrice * (1 + totalReturn * (0.72 + assetIndex * 0.08));
    const entryDate = new Date(start.getTime() + duration * 0.04);
    const exitDate = new Date(start.getTime() + duration * 0.92);

    return [
      {
        id: `${selectedAsset.symbol}-buy`,
        date: entryDate.toISOString().slice(0, 10),
        symbol: selectedAsset.symbol,
        side: "buy" as const,
        price: entryPrice,
        quantity,
        fee: entryPrice * quantity * (values.feeRate / 100),
        returnRate: null,
      },
      {
        id: `${selectedAsset.symbol}-sell`,
        date: exitDate.toISOString().slice(0, 10),
        symbol: selectedAsset.symbol,
        side: "sell" as const,
        price: exitPrice,
        quantity,
        fee: exitPrice * quantity * (values.feeRate / 100),
        returnRate: exitPrice / entryPrice - 1,
      },
    ];
  });
}

export function generateBacktestResult(
  values: BacktestFormValues,
  selectedAssets: readonly SelectedBacktestAsset[],
): BacktestResult {
  const years = getYears(values.startDate, values.endDate);
  const weightedReturn = getWeightedMetric(selectedAssets, "annualReturn");
  const weightedVolatility = getWeightedMetric(selectedAssets, "volatility");
  const annualCosts =
    ((values.feeRate + values.slippageRate) / 100) *
    (values.rebalanceFrequency === "weekly"
      ? 12
      : values.rebalanceFrequency === "monthly"
        ? 4
        : 1.5);
  const annualizedReturn = Math.max(
    -0.85,
    weightedReturn *
      strategyReturnFactor[values.strategy] -
      annualCosts,
  );
  const totalReturn = (1 + annualizedReturn) ** years - 1;
  const benchmarkReturn =
    (1 + benchmarkAnnualReturn[values.benchmark]) ** years - 1;
  const chart = createChart(
    values,
    totalReturn,
    benchmarkReturn,
    weightedVolatility * strategyRiskFactor[values.strategy],
  );
  const maxDrawdown = Math.min(...chart.map((point) => point.drawdown));
  const trades = createTrades(values, selectedAssets, totalReturn);

  return {
    generatedAt: "2026-06-22T10:40:00+09:00",
    currency: values.currency,
    totalReturn,
    annualizedReturn,
    benchmarkReturn,
    excessReturn: totalReturn - benchmarkReturn,
    maxDrawdown,
    sharpeRatio:
      annualizedReturn /
      Math.max(
        weightedVolatility * strategyRiskFactor[values.strategy],
        0.01,
      ),
    winRate: Math.min(0.88, 0.54 + annualizedReturn * 0.45),
    tradeCount: trades.length,
    finalValue: values.initialCapital * (1 + totalReturn),
    chart,
    trades,
  };
}
