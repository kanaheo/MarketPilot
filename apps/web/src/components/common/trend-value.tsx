import type { TrendValueProps } from "@/types/common";

export function TrendValue({ children, value }: TrendValueProps) {
  const tone = value > 0 ? "positive" : value < 0 ? "negative" : "neutral";

  return <span className={`trend-value ${tone}`}>{children}</span>;
}
