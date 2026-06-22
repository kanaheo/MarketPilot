import type { BacktestsHeaderProps } from "@/types/backtests";

export function BacktestsHeader({ messages }: BacktestsHeaderProps) {
  return (
    <header className="backtests-header">
      <div>
        <span className="backtests-eyebrow">{messages.eyebrow}</span>
        <h1>{messages.title}</h1>
        <p>{messages.description}</p>
      </div>
      <span className="backtests-data-badge">{messages.dataBadge}</span>
    </header>
  );
}
