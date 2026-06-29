import { ArrowDown, ArrowUp, TrendingUp, WalletCards } from "lucide-react";

import { SummaryCard } from "@/components/common/summary-card";
import { formatMarketPrice } from "@/lib/formatters";
import type { PortfolioSummaryProps } from "@/types/portfolio";

export function PortfolioSummary({
  currency,
  currentCash,
  locale,
  messages,
  totalValue,
}: PortfolioSummaryProps) {
  const cards = [
    {
      label: messages.cards.totalValue,
      value: formatMarketPrice(totalValue, currency, locale),
      icon: TrendingUp,
      tone: "neutral" as const,
    },
    {
      label: messages.cards.availableCash,
      value: formatMarketPrice(currentCash, currency, locale),
      icon: WalletCards,
      tone: "neutral" as const,
    },
    {
      label: messages.cards.totalReturn,
      value: messages.unavailable,
      icon: ArrowUp,
      tone: "neutral" as const,
    },
    {
      label: messages.cards.maxDrawdown,
      value: messages.unavailable,
      icon: ArrowDown,
      tone: "neutral" as const,
    },
  ];

  return (
    <section className="portfolio-summary-grid" aria-label={messages.label}>
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </section>
  );
}
