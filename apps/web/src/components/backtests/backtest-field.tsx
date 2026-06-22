import type { BacktestFieldProps } from "@/types/backtests";

export function BacktestField({
  children,
  error,
  hint,
  htmlFor,
  label,
}: BacktestFieldProps) {
  const descriptionId = `${htmlFor}-description`;

  return (
    <div className="backtest-field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error ? (
        <span className="backtest-field-error" id={descriptionId} role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="backtest-field-hint" id={descriptionId}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}
