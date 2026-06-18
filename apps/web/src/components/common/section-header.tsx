import { ChevronRight } from "lucide-react";

import type { SectionHeaderProps } from "@/types/common";

export function SectionHeader({
  actionLabel,
  description,
  icon: Icon,
  meta,
  title,
}: SectionHeaderProps) {
  return (
    <header className="section-header">
      <div className="section-heading">
        <div className="section-title-row">
          {Icon ? <Icon size={19} aria-hidden="true" /> : null}
          <h2>{title}</h2>
        </div>
        {description ? <p>{description}</p> : null}
      </div>

      {actionLabel ? (
        <button className="text-action" type="button">
          <span>{actionLabel}</span>
          <ChevronRight size={15} aria-hidden="true" />
        </button>
      ) : meta ? (
        <span className="section-meta">{meta}</span>
      ) : null}
    </header>
  );
}
