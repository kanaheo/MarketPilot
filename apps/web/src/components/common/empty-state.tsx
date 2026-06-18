import { Inbox } from "lucide-react";

import type { EmptyStateProps } from "@/types/common";

export function EmptyState({
  actionLabel,
  description,
  icon: Icon = Inbox,
  title,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="state-icon empty" aria-hidden="true">
        <Icon size={21} strokeWidth={1.8} />
      </span>
      <strong>{title}</strong>
      <p>{description}</p>
      {actionLabel ? (
        <button className="state-action secondary" type="button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
