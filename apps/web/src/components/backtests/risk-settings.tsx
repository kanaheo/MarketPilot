import { ShieldCheck } from "lucide-react";

import { BacktestField } from "@/components/backtests/backtest-field";
import { PercentageField } from "@/components/backtests/percentage-field";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import type { BacktestFormSectionProps } from "@/types/backtests";

export function RiskSettings({
  errors,
  messages,
  register,
}: BacktestFormSectionProps) {
  return (
    <Panel className="backtest-risk-panel">
      <SectionHeader
        description={messages.risk.description}
        icon={ShieldCheck}
        title={messages.risk.title}
      />

      <div className="backtest-risk-grid">
        <PercentageField
          error={errors.maxPositionWeight?.message}
          hint={messages.risk.hints.maxPositionWeight}
          id="backtest-max-position"
          label={messages.risk.fields.maxPositionWeight}
          max={100}
          min={1}
          registration={register("maxPositionWeight", { valueAsNumber: true })}
        />

        <PercentageField
          error={errors.cashReserve?.message}
          hint={messages.risk.hints.cashReserve}
          id="backtest-cash-reserve"
          label={messages.risk.fields.cashReserve}
          max={100}
          registration={register("cashReserve", { valueAsNumber: true })}
        />

        <PercentageField
          error={errors.stopLoss?.message}
          hint={messages.risk.hints.stopLoss}
          id="backtest-stop-loss"
          label={messages.risk.fields.stopLoss}
          max={50}
          registration={register("stopLoss", { valueAsNumber: true })}
        />

        <BacktestField
          htmlFor="backtest-rebalance"
          label={messages.risk.fields.rebalanceFrequency}
        >
          <select
            id="backtest-rebalance"
            {...register("rebalanceFrequency")}
          >
            {messages.risk.options.rebalanceFrequencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </BacktestField>

        <PercentageField
          error={errors.feeRate?.message}
          id="backtest-fee-rate"
          label={messages.risk.fields.feeRate}
          max={5}
          registration={register("feeRate", { valueAsNumber: true })}
          step={0.01}
        />

        <PercentageField
          error={errors.slippageRate?.message}
          id="backtest-slippage-rate"
          label={messages.risk.fields.slippageRate}
          max={5}
          registration={register("slippageRate", { valueAsNumber: true })}
          step={0.01}
        />

        <BacktestField
          hint={messages.risk.hints.executionTiming}
          htmlFor="backtest-execution"
          label={messages.risk.fields.executionTiming}
        >
          <select id="backtest-execution" {...register("executionTiming")}>
            {messages.risk.options.executionTimings.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </BacktestField>
      </div>
    </Panel>
  );
}
