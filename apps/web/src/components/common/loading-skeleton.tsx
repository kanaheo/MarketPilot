import type { LoadingSkeletonProps } from "@/types/common";

export function LoadingSkeleton({
  className = "",
  height,
  width = "100%",
}: LoadingSkeletonProps) {
  return (
    <span
      className={`loading-skeleton ${className}`.trim()}
      style={{ height, width }}
      aria-hidden="true"
    />
  );
}
