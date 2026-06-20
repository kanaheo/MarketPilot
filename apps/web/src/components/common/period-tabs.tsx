import type { PeriodTabsProps } from "@/types/common";

export function PeriodTabs({ ariaLabel, periods }: PeriodTabsProps) {
  return (
    <div className="period-tabs" aria-label={ariaLabel}>
      {periods.map((period) => (
        <button
          className={period.active ? "active" : ""}
          key={period.label}
          type="button"
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
