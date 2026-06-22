import { ShieldCheck } from "lucide-react";

import { BacktestField } from "@/components/backtests/backtest-field";
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
        <BacktestField
          error={errors.maxPositionWeight?.message}
          hint={messages.risk.hints.maxPositionWeight}
          htmlFor="backtest-max-position"
          label={messages.risk.fields.maxPositionWeight}
        >
          <div className="backtest-suffix-input">
            <input
              aria-describedby="backtest-max-position-description"
              aria-invalid={Boolean(errors.maxPositionWeight)}
              id="backtest-max-position"
              max="100"
              min="1"
              step="1"
              type="number"
              {...register("maxPositionWeight", { valueAsNumber: true })}
            />
            <span>%</span>
          </div>
        </BacktestField>

        <BacktestField
          error={errors.cashReserve?.message}
          hint={messages.risk.hints.cashReserve}
          htmlFor="backtest-cash-reserve"
          label={messages.risk.fields.cashReserve}
        >
          <div className="backtest-suffix-input">
            <input
              aria-describedby="backtest-cash-reserve-description"
              aria-invalid={Boolean(errors.cashReserve)}
              id="backtest-cash-reserve"
              max="100"
              min="0"
              step="1"
              type="number"
              {...register("cashReserve", { valueAsNumber: true })}
            />
            <span>%</span>
          </div>
        </BacktestField>

        <BacktestField
          error={errors.stopLoss?.message}
          hint={messages.risk.hints.stopLoss}
          htmlFor="backtest-stop-loss"
          label={messages.risk.fields.stopLoss}
        >
          <div className="backtest-suffix-input">
            <input
              aria-describedby="backtest-stop-loss-description"
              aria-invalid={Boolean(errors.stopLoss)}
              id="backtest-stop-loss"
              max="50"
              min="0"
              step="1"
              type="number"
              {...register("stopLoss", { valueAsNumber: true })}
            />
            <span>%</span>
          </div>
        </BacktestField>

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

        <BacktestField
          error={errors.feeRate?.message}
          htmlFor="backtest-fee-rate"
          label={messages.risk.fields.feeRate}
        >
          <div className="backtest-suffix-input">
            <input
              aria-describedby="backtest-fee-rate-description"
              aria-invalid={Boolean(errors.feeRate)}
              id="backtest-fee-rate"
              max="5"
              min="0"
              step="0.01"
              type="number"
              {...register("feeRate", { valueAsNumber: true })}
            />
            <span>%</span>
          </div>
        </BacktestField>

        <BacktestField
          error={errors.slippageRate?.message}
          htmlFor="backtest-slippage-rate"
          label={messages.risk.fields.slippageRate}
        >
          <div className="backtest-suffix-input">
            <input
              aria-describedby="backtest-slippage-rate-description"
              aria-invalid={Boolean(errors.slippageRate)}
              id="backtest-slippage-rate"
              max="5"
              min="0"
              step="0.01"
              type="number"
              {...register("slippageRate", { valueAsNumber: true })}
            />
            <span>%</span>
          </div>
        </BacktestField>

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
