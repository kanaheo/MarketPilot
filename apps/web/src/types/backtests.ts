import type {
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";

import type { Messages } from "@/types/i18n";

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
  messages: BacktestsMessages;
}>;

export type BacktestFormSectionProps = Readonly<{
  errors: FieldErrors<BacktestFormValues>;
  messages: BacktestsMessages;
  register: UseFormRegister<BacktestFormValues>;
  watch: UseFormWatch<BacktestFormValues>;
}>;

export type BacktestFieldProps = Readonly<{
  children: React.ReactNode;
  error?: string;
  hint?: string;
  htmlFor: string;
  label: string;
}>;
