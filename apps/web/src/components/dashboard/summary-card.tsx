import type { LucideIcon } from "lucide-react";

import type { SummaryCardProps } from "@/types/dashboard";

const toneClassNames = {
  positive: "positive",
  neutral: "neutral",
  warning: "warning",
} as const;

export function SummaryCard({
  detail,
  detailAside,
  icon: Icon,
  label,
  tone,
  value,
}: SummaryCardProps & { icon: LucideIcon }) {
  return (
    <article className="summary-card">
      <div className="summary-card-heading">
        <span>{label}</span>
        <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
      </div>
      <strong className="summary-card-value">{value}</strong>
      <div className={`summary-card-detail ${toneClassNames[tone]}`}>
        <span>{detail}</span>
        {detailAside ? <span>{detailAside}</span> : null}
      </div>
    </article>
  );
}
