import { CircleDollarSign, Gauge, Shield, WalletCards } from "lucide-react";

import { SummaryCard } from "@/components/dashboard/summary-card";
import type { DashboardSummaryProps } from "@/types/dashboard";

export function DashboardSummary({ messages }: DashboardSummaryProps) {
  const cards = [
    {
      ...messages.cards.totalValue,
      icon: WalletCards,
      tone: "positive" as const,
    },
    {
      ...messages.cards.availableCash,
      icon: CircleDollarSign,
      tone: "neutral" as const,
    },
    {
      ...messages.cards.todayProfit,
      icon: Gauge,
      tone: "positive" as const,
    },
    {
      ...messages.cards.maxDrawdown,
      icon: Shield,
      tone: "warning" as const,
    },
  ];

  return (
    <section
      className="dashboard-summary-grid"
      aria-label={messages.summaryLabel}
    >
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </section>
  );
}
