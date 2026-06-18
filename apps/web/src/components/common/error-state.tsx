import { AlertTriangle, RotateCcw } from "lucide-react";

import type { ErrorStateProps } from "@/types/common";

export function ErrorState({
  actionLabel,
  description,
  onRetry,
  title,
}: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <span className="state-icon error" aria-hidden="true">
        <AlertTriangle size={22} strokeWidth={1.9} />
      </span>
      <strong>{title}</strong>
      <p>{description}</p>
      <button className="state-action primary" onClick={onRetry} type="button">
        <RotateCcw size={15} aria-hidden="true" />
        <span>{actionLabel}</span>
      </button>
    </div>
  );
}
