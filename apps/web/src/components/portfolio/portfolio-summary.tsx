import { ArrowDown, ArrowUp, TrendingUp, WalletCards } from "lucide-react";

import { SummaryCard } from "@/components/common/summary-card";
import { portfolioData } from "@/data/portfolio";
import { formatDollar, formatPercent } from "@/lib/formatters";
import type { PortfolioSummaryProps } from "@/types/portfolio";

export function PortfolioSummary({ locale, messages }: PortfolioSummaryProps) {
  const { summary } = portfolioData;
  const cards = [
    {
      label: messages.cards.totalValue,
      value: formatDollar(summary.totalValue.value, locale),
      detail: `↗ ${formatDollar(summary.totalValue.gain, locale)} (${formatPercent(
        summary.totalValue.returnRate,
        locale,
        { signDisplay: "never" },
      )})`,
      icon: TrendingUp,
      tone: "positive" as const,
    },
    {
      label: messages.cards.availableCash,
      value: formatDollar(summary.availableCash.value, locale),
      icon: WalletCards,
      tone: "neutral" as const,
    },
    {
      label: messages.cards.totalReturn,
      value: formatPercent(summary.totalReturn.value, locale),
      detail: `↗ ${formatDollar(summary.totalReturn.gain, locale)}`,
      icon: ArrowUp,
      tone: "positive" as const,
    },
    {
      label: messages.cards.maxDrawdown,
      value: formatPercent(summary.maxDrawdown.value, locale),
      icon: ArrowDown,
      tone: "negative" as const,
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
