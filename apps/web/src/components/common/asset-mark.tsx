import type { AssetMarkProps } from "@/types/common";

export function AssetMark({ color, symbol }: AssetMarkProps) {
  return (
    <span
      className="asset-mark"
      style={{ "--asset-color": color } as React.CSSProperties}
      aria-hidden="true"
    >
      {symbol.slice(0, 1)}
    </span>
  );
}
