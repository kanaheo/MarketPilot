import type { SummaryCardProps } from "@/types/common";

const toneClassNames = {
  negative: "negative",
  neutral: "neutral",
  positive: "positive",
  warning: "warning",
} as const;

export function SummaryCard({
  detail,
  detailAside,
  icon: Icon,
  label,
  tone,
  value,
}: SummaryCardProps) {
  return (
    <article className="summary-card">
      <div className="summary-card-heading">
        <span>{label}</span>
        <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <strong className="summary-card-value">{value}</strong>
      {detail || detailAside ? (
        <div className={`summary-card-detail ${toneClassNames[tone]}`}>
          {detail ? <span>{detail}</span> : null}
          {detailAside ? <span>{detailAside}</span> : null}
        </div>
      ) : null}
    </article>
  );
}
