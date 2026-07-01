import { ArrowUp, TrendingUp, WalletCards } from "lucide-react";

import { SummaryCard } from "@/components/common/summary-card";
import { formatMarketPrice, formatPercent } from "@/lib/formatters";
import type { SummaryCardProps } from "@/types/common";
import type { PortfolioSummaryProps } from "@/types/portfolio";

export function PortfolioSummary({
  currency,
  currentCash,
  locale,
  messages,
  realizedProfitLoss,
  totalProfitLoss,
  totalReturnRate,
  totalValue,
}: PortfolioSummaryProps) {
  const totalReturnTone =
    totalReturnRate > 0
      ? "positive"
      : totalReturnRate < 0
        ? "negative"
        : "neutral";
  const realizedProfitLossTone =
    realizedProfitLoss > 0
      ? "positive"
      : realizedProfitLoss < 0
        ? "negative"
        : "neutral";

  const cards: SummaryCardProps[] = [
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
      value: formatPercent(totalReturnRate, locale),
      detail: formatMarketPrice(totalProfitLoss, currency, locale),
      icon: ArrowUp,
      tone: totalReturnTone,
    },
    {
      label: messages.cards.realizedProfitLoss,
      value: formatMarketPrice(realizedProfitLoss, currency, locale),
      icon: ArrowUp,
      tone: realizedProfitLossTone,
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
