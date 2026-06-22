import type { MarketsHeaderProps } from "@/types/markets";

export function MarketsHeader({ messages }: MarketsHeaderProps) {
  return (
    <header className="markets-header">
      <div>
        <span className="markets-eyebrow">{messages.eyebrow}</span>
        <h1>{messages.title}</h1>
        <p>{messages.description}</p>
      </div>
      <span className="markets-data-badge">{messages.dataBadge}</span>
    </header>
  );
}
