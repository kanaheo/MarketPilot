"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Play, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { RiskSettings } from "@/components/backtests/risk-settings";
import { SimulationSettings } from "@/components/backtests/simulation-settings";
import { createBacktestSchema } from "@/lib/validation/backtests";
import type {
  BacktestFormValues,
  BacktestSetupProps,
} from "@/types/backtests";

const defaultValues: BacktestFormValues = {
  startDate: "2021-01-04",
  endDate: "2025-12-31",
  initialCapital: 100000,
  currency: "USD",
  benchmark: "SPY",
  strategy: "momentum",
  maxPositionWeight: 20,
  cashReserve: 10,
  stopLoss: 8,
  rebalanceFrequency: "monthly",
  feeRate: 0.1,
  slippageRate: 0.05,
  executionTiming: "nextOpen",
};

export function BacktestSetup({ messages }: BacktestSetupProps) {
  const [isValidated, setIsValidated] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    watch,
  } = useForm<BacktestFormValues>({
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(createBacktestSchema(messages.validation)),
  });

  async function validateSetup() {
    setIsValidated(false);
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    setIsValidated(true);
  }

  return (
    <form
      className="backtest-setup"
      noValidate
      onSubmit={handleSubmit(validateSetup)}
    >
      <div className="backtest-configuration-grid">
        <SimulationSettings
          errors={errors}
          messages={messages}
          register={register}
          watch={watch}
        />
        <RiskSettings
          errors={errors}
          messages={messages}
          register={register}
          watch={watch}
        />
      </div>

      <div className="backtest-run-bar">
        <div>
          <ShieldAlert size={17} aria-hidden="true" />
          <p>
            <strong>{messages.action.noticeTitle}</strong>
            <span>{messages.action.noticeDescription}</span>
          </p>
        </div>

        <div className="backtest-run-actions">
          <span aria-live="polite">
            {isValidated ? messages.action.validated : ""}
          </span>
          <button disabled={isSubmitting} type="submit">
            <Play size={16} fill="currentColor" aria-hidden="true" />
            {isSubmitting ? messages.action.validating : messages.action.run}
          </button>
        </div>
      </div>
    </form>
  );
}
