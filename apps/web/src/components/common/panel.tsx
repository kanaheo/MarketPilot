import type { PanelProps } from "@/types/common";

export function Panel({ children, className = "" }: PanelProps) {
  return <section className={`panel ${className}`.trim()}>{children}</section>;
}
