import type { UseFormRegisterReturn } from "react-hook-form";

import { BacktestField } from "@/components/backtests/backtest-field";

type PercentageFieldProps = Readonly<{
  error?: string;
  hint?: string;
  id: string;
  label: string;
  max: number;
  min?: number;
  registration: UseFormRegisterReturn;
  step?: number;
}>;

export function PercentageField({
  error,
  hint,
  id,
  label,
  max,
  min = 0,
  registration,
  step = 1,
}: PercentageFieldProps) {
  return (
    <BacktestField
      error={error}
      hint={hint}
      htmlFor={id}
      label={label}
    >
      <div className="backtest-suffix-input">
        <input
          aria-describedby={`${id}-description`}
          aria-invalid={Boolean(error)}
          id={id}
          max={max}
          min={min}
          step={step}
          type="number"
          {...registration}
        />
        <span>%</span>
      </div>
    </BacktestField>
  );
}
