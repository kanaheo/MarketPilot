import { CalendarRange, Coins, Gauge, LineChart } from "lucide-react";

import { BacktestField } from "@/components/backtests/backtest-field";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import type {
  BacktestFormSectionProps,
  BacktestStrategy,
} from "@/types/backtests";

const strategies: readonly BacktestStrategy[] = [
  "momentum",
  "movingAverage",
  "buyAndHold",
];

export function SimulationSettings({
  errors,
  messages,
  register,
  watch,
}: BacktestFormSectionProps) {
  const selectedStrategy = watch("strategy");

  return (
    <Panel className="backtest-settings-panel">
      <SectionHeader
        description={messages.setup.description}
        icon={Gauge}
        title={messages.setup.title}
      />

      <div className="backtest-field-grid">
        <BacktestField
          error={errors.startDate?.message}
          htmlFor="backtest-start-date"
          label={messages.setup.fields.startDate}
        >
          <div className="backtest-input-with-icon">
            <CalendarRange size={16} aria-hidden="true" />
            <input
              aria-describedby="backtest-start-date-description"
              aria-invalid={Boolean(errors.startDate)}
              id="backtest-start-date"
              type="date"
              {...register("startDate")}
            />
          </div>
        </BacktestField>

        <BacktestField
          error={errors.endDate?.message}
          htmlFor="backtest-end-date"
          label={messages.setup.fields.endDate}
        >
          <div className="backtest-input-with-icon">
            <CalendarRange size={16} aria-hidden="true" />
            <input
              aria-describedby="backtest-end-date-description"
              aria-invalid={Boolean(errors.endDate)}
              id="backtest-end-date"
              type="date"
              {...register("endDate")}
            />
          </div>
        </BacktestField>

        <BacktestField
          error={errors.initialCapital?.message}
          hint={messages.setup.hints.initialCapital}
          htmlFor="backtest-initial-capital"
          label={messages.setup.fields.initialCapital}
        >
          <div className="backtest-input-with-icon">
            <Coins size={16} aria-hidden="true" />
            <input
              aria-describedby="backtest-initial-capital-description"
              aria-invalid={Boolean(errors.initialCapital)}
              id="backtest-initial-capital"
              inputMode="decimal"
              min="1000"
              step="1000"
              type="number"
              {...register("initialCapital", { valueAsNumber: true })}
            />
          </div>
        </BacktestField>

        <BacktestField
          htmlFor="backtest-currency"
          label={messages.setup.fields.currency}
        >
          <select id="backtest-currency" {...register("currency")}>
            {messages.setup.options.currencies.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </BacktestField>

        <BacktestField
          htmlFor="backtest-benchmark"
          label={messages.setup.fields.benchmark}
        >
          <select id="backtest-benchmark" {...register("benchmark")}>
            {messages.setup.options.benchmarks.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </BacktestField>
      </div>

      <fieldset className="strategy-presets">
        <legend>
          <LineChart size={16} aria-hidden="true" />
          <span>{messages.setup.fields.strategy}</span>
        </legend>
        <div className="strategy-preset-grid">
          {strategies.map((strategy) => {
            const strategyMessages = messages.setup.strategies[strategy];

            return (
              <label
                className="strategy-preset"
                data-active={selectedStrategy === strategy}
                key={strategy}
              >
                <input
                  className="sr-only"
                  type="radio"
                  value={strategy}
                  {...register("strategy")}
                />
                <span className="strategy-preset-check" aria-hidden="true" />
                <strong>{strategyMessages.title}</strong>
                <small>{strategyMessages.description}</small>
              </label>
            );
          })}
        </div>
      </fieldset>
    </Panel>
  );
}
