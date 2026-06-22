import type {
  BacktestAsset,
  BacktestFormValues,
  BacktestStrategy,
  SelectedBacktestAsset,
} from "@/types/backtests";

export const backtestAssets = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    color: "#555b62",
    annualReturn: 0.252,
    volatility: 0.284,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    color: "#76b900",
    annualReturn: 0.468,
    volatility: 0.512,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    color: "#2878d7",
    annualReturn: 0.224,
    volatility: 0.247,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    color: "#ff9900",
    annualReturn: 0.173,
    volatility: 0.341,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    color: "#4285f4",
    annualReturn: 0.186,
    volatility: 0.276,
  },
  {
    symbol: "005930",
    name: "Samsung Electronics",
    color: "#1f55a5",
    annualReturn: 0.072,
    volatility: 0.238,
  },
  {
    symbol: "000660",
    name: "SK hynix",
    color: "#e6532f",
    annualReturn: 0.194,
    volatility: 0.376,
  },
  {
    symbol: "7203",
    name: "Toyota Motor",
    color: "#d71920",
    annualReturn: 0.142,
    volatility: 0.221,
  },
] as const satisfies readonly BacktestAsset[];

export const defaultSelectedAssets = [
  { symbol: "AAPL", weight: 45 },
  { symbol: "NVDA", weight: 45 },
] as const satisfies readonly SelectedBacktestAsset[];

export const defaultBacktestValues = {
  startDate: "2021-01-04",
  endDate: "2025-12-31",
  initialCapital: 100_000,
  currency: "USD",
  benchmark: "SPY",
  strategy: "momentum",
  maxPositionWeight: 45,
  cashReserve: 10,
  stopLoss: 8,
  rebalanceFrequency: "monthly",
  feeRate: 0.1,
  slippageRate: 0.05,
  executionTiming: "nextOpen",
} as const satisfies BacktestFormValues;

export const backtestStrategies = [
  "momentum",
  "movingAverage",
  "buyAndHold",
] as const satisfies readonly BacktestStrategy[];

const backtestAssetBySymbol = new Map<string, BacktestAsset>(
  backtestAssets.map((asset) => [asset.symbol, asset]),
);

export function getBacktestAsset(symbol: string) {
  return backtestAssetBySymbol.get(symbol);
}
