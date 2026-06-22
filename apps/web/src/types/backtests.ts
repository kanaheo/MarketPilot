import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import type { Locale, Messages } from "@/types/i18n";

export type BacktestStrategy = "momentum" | "movingAverage" | "buyAndHold";
export type BacktestCurrency = "USD" | "KRW" | "JPY";
export type BacktestBenchmark = "SPY" | "KOSPI" | "NIKKEI225";
export type RebalanceFrequency = "weekly" | "monthly" | "quarterly";
export type ExecutionTiming = "nextOpen" | "sameClose";

export type BacktestFormValues = {
  startDate: string;
  endDate: string;
  initialCapital: number;
  currency: BacktestCurrency;
  benchmark: BacktestBenchmark;
  strategy: BacktestStrategy;
  maxPositionWeight: number;
  cashReserve: number;
  stopLoss: number;
  rebalanceFrequency: RebalanceFrequency;
  feeRate: number;
  slippageRate: number;
  executionTiming: ExecutionTiming;
};

export type BacktestAsset = Readonly<{
  symbol: string;
  name: string;
  color: string;
  annualReturn: number;
  volatility: number;
}>;

export type SelectedBacktestAsset = Readonly<{
  symbol: string;
  weight: number;
}>;

export type BacktestChartPoint = Readonly<{
  date: string;
  portfolio: number;
  benchmark: number;
  drawdown: number;
}>;

export type BacktestTrade = Readonly<{
  id: string;
  date: string;
  symbol: string;
  side: "buy" | "sell";
  price: number;
  quantity: number;
  fee: number;
  returnRate: number | null;
}>;

export type BacktestResult = Readonly<{
  currency: BacktestCurrency;
  totalReturn: number;
  annualizedReturn: number;
  benchmarkReturn: number;
  excessReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  tradeCount: number;
  finalValue: number;
  chart: readonly BacktestChartPoint[];
  trades: readonly BacktestTrade[];
}>;

export type BacktestsMessages = Messages["backtests"];

export type BacktestsPageProps = Readonly<{
  params: Promise<{
    locale: string;
  }>;
}>;

export type BacktestsHeaderProps = Readonly<{
  messages: BacktestsMessages["header"];
}>;

export type BacktestSetupProps = Readonly<{
  locale: Locale;
  messages: BacktestsMessages;
}>;

export type BacktestFormSectionProps = Readonly<{
  errors: FieldErrors<BacktestFormValues>;
  messages: BacktestsMessages;
  register: UseFormRegister<BacktestFormValues>;
}>;

export type SimulationSettingsProps = BacktestFormSectionProps &
  Readonly<{
    selectedStrategy: BacktestStrategy;
  }>;

export type BacktestFieldProps = Readonly<{
  children: React.ReactNode;
  error?: string;
  hint?: string;
  htmlFor: string;
  label: string;
}>;

export type AssetSelectionProps = Readonly<{
  cashReserve: number;
  error: string;
  messages: BacktestsMessages["assets"];
  onAdd: (symbol: string) => void;
  onEqualize: () => void;
  onRemove: (symbol: string) => void;
  onWeightChange: (symbol: string, weight: number) => void;
  selectedAssets: readonly SelectedBacktestAsset[];
}>;

export type BacktestResultsProps = Readonly<{
  locale: Locale;
  messages: BacktestsMessages;
  result: BacktestResult;
}>;
