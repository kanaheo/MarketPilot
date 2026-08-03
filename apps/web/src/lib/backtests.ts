import { getBacktestAsset } from "@/data/backtests";
import type {
  BacktestAsset,
  BacktestBenchmark,
  BacktestFormValues,
  BacktestResult,
  BacktestStrategy,
  BacktestsMessages,
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

const rebalanceTurnoverFactor: Record<
  BacktestFormValues["rebalanceFrequency"],
  number
> = {
  weekly: 12,
  monthly: 4,
  quarterly: 1.5,
};

const executionTimingSlippageFactor: Record<
  BacktestFormValues["executionTiming"],
  number
> = {
  nextOpen: 1,
  sameClose: 0.65,
};

function getYears(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();

  return Math.max((end - start) / (365.25 * 24 * 60 * 60 * 1000), 1 / 12);
}

export function equalizeBacktestAssetWeights(
  selectedAssets: readonly SelectedBacktestAsset[],
  cashReserve: number,
) {
  if (selectedAssets.length === 0) {
    return selectedAssets;
  }

  const targetWeight = Math.max(0, 100 - cashReserve);
  const equalWeight = Number(
    (targetWeight / selectedAssets.length).toFixed(2),
  );
  const lastWeight = Number(
    (targetWeight - equalWeight * (selectedAssets.length - 1)).toFixed(2),
  );

  return selectedAssets.map((asset, index) => ({
    ...asset,
    weight: index === selectedAssets.length - 1 ? lastWeight : equalWeight,
  }));
}

export function getAssetAllocationError(
  selectedAssets: readonly SelectedBacktestAsset[],
  values: Pick<BacktestFormValues, "cashReserve" | "maxPositionWeight">,
  messages: BacktestsMessages["validation"],
) {
  if (selectedAssets.length === 0) {
    return messages.assetsRequired;
  }

  if (
    selectedAssets.some(
      (asset) =>
        asset.weight <= 0 || asset.weight > values.maxPositionWeight,
    )
  ) {
    return messages.assetWeight;
  }

  const selectedWeight = selectedAssets.reduce(
    (total, asset) => total + asset.weight,
    0,
  );
  const targetWeight = 100 - values.cashReserve;

  return Math.abs(selectedWeight - targetWeight) > 0.01
    ? messages.totalWeight
    : null;
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
  const stopLossFloor =
    values.stopLoss > 0 ? -(values.stopLoss / 100) : null;

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
    const rawPortfolio =
      values.initialCapital *
      Math.max(0.2, 1 + totalReturn * progress + seasonalMove + correction);
    peak = Math.max(peak, rawPortfolio);
    const rawDrawdown = rawPortfolio / peak - 1;
    const portfolio =
      stopLossFloor !== null && rawDrawdown < stopLossFloor
        ? peak * (1 + stopLossFloor)
        : rawPortfolio;
    const benchmark =
      values.initialCapital *
      (1 +
        benchmarkReturn * progress +
        Math.sin(index * 0.92) * 0.018 * progress);

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
    const slippageRate =
      (values.slippageRate / 100) *
      executionTimingSlippageFactor[values.executionTiming];
    const referenceEntryPrice = 80 + (assetIndex + 1) * 37.25;
    const entryPrice = referenceEntryPrice * (1 + slippageRate);
    const quantity = Math.max(
      1,
      Math.floor(
        (values.initialCapital * (selectedAsset.weight / 100)) / entryPrice,
      ),
    );
    const exitPrice =
      referenceEntryPrice *
      (1 + totalReturn * (0.72 + assetIndex * 0.08)) *
      (1 - slippageRate);
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
  const turnoverFactor =
    rebalanceTurnoverFactor[values.rebalanceFrequency];
  const annualCosts =
    (values.feeRate / 100) * turnoverFactor +
    (values.slippageRate / 100) *
      turnoverFactor *
      executionTimingSlippageFactor[values.executionTiming];
  const rawAnnualizedReturn = Math.max(
    -0.85,
    weightedReturn *
      strategyReturnFactor[values.strategy] -
      annualCosts,
  );
  const rawTotalReturn = (1 + rawAnnualizedReturn) ** years - 1;
  const benchmarkReturn =
    (1 + benchmarkAnnualReturn[values.benchmark]) ** years - 1;
  const chart = createChart(
    values,
    rawTotalReturn,
    benchmarkReturn,
    weightedVolatility * strategyRiskFactor[values.strategy],
  );
  const finalValue =
    chart[chart.length - 1]?.portfolio ??
    values.initialCapital * (1 + rawTotalReturn);
  const totalReturn = finalValue / values.initialCapital - 1;
  const annualizedReturn =
    totalReturn > -1 ? (1 + totalReturn) ** (1 / years) - 1 : -1;
  const maxDrawdown = Math.min(...chart.map((point) => point.drawdown));
  const trades = createTrades(values, selectedAssets, totalReturn);

  return {
    currency: values.currency,
    assumptions: {
      cashReserve: values.cashReserve,
      executionTiming: values.executionTiming,
      feeRate: values.feeRate,
      maxPositionWeight: values.maxPositionWeight,
      rebalanceFrequency: values.rebalanceFrequency,
      slippageRate: values.slippageRate,
      stopLoss: values.stopLoss,
    },
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
    finalValue,
    chart,
    trades,
  };
}
