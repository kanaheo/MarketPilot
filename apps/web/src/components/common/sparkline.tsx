import type { SparklineProps } from "@/types/common";

export function Sparkline({
  className = "",
  points,
  positive,
}: SparklineProps) {
  const minimum = Math.min(...points);
  const maximum = Math.max(...points);
  const range = maximum - minimum || 1;
  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 28 - ((point - minimum) / range) * 24;

      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg
      aria-hidden="true"
      className={`sparkline ${positive ? "positive" : "negative"} ${className}`.trim()}
      viewBox="0 0 100 32"
    >
      <path d={path} fill="none" stroke="currentColor" />
    </svg>
  );
}
