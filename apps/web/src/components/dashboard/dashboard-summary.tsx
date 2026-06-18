import { CircleDollarSign, Gauge, Shield, WalletCards } from "lucide-react";

import { SummaryCard } from "@/components/dashboard/summary-card";
import { dashboardData } from "@/data/dashboard";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { DashboardSummaryProps } from "@/types/dashboard";

export function DashboardSummary({ locale, messages }: DashboardSummaryProps) {
  const { summary } = dashboardData;
  const cards = [
    {
      label: messages.cards.totalValue.label,
      value: formatCurrency(summary.totalValue.value, locale),
      detail: `↗ ${formatPercent(summary.totalValue.returnRate, locale)}`,
      detailAside: `${messages.cards.totalValue.detail} ${formatCurrency(
        summary.totalValue.investmentGain,
        locale,
        { signDisplay: "exceptZero" },
      )}`,
      icon: WalletCards,
      tone: "positive" as const,
    },
    {
      label: messages.cards.availableCash.label,
      value: formatCurrency(summary.availableCash.value, locale),
      detail: `${messages.cards.availableCash.detail} ${formatPercent(
        summary.availableCash.cashRatio,
        locale,
        { signDisplay: "never" },
      )}`,
      detailAside: `${messages.cards.availableCash.detailAside} ${formatCurrency(
        summary.availableCash.recentDeposit,
        locale,
        { signDisplay: "exceptZero" },
      )}`,
      icon: CircleDollarSign,
      tone: "neutral" as const,
    },
    {
      label: messages.cards.todayProfit.label,
      value: formatCurrency(summary.todayProfit.value, locale, {
        signDisplay: "exceptZero",
      }),
      detail: `↗ ${formatPercent(summary.todayProfit.returnRate, locale)}`,
      detailAside: `${messages.cards.todayProfit.detail} ${formatPercent(
        summary.todayProfit.benchmarkDifference,
        locale,
      )}`,
      icon: Gauge,
      tone: "positive" as const,
    },
    {
      label: messages.cards.maxDrawdown.label,
      value: formatPercent(summary.maxDrawdown.value, locale),
      detail: `${messages.cards.maxDrawdown.detail} ${formatPercent(
        summary.maxDrawdown.riskBudgetUsed,
        locale,
        {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
          signDisplay: "never",
        },
      )}`,
      detailAside: `${messages.cards.maxDrawdown.detailAside} ${formatPercent(
        summary.maxDrawdown.limit,
        locale,
      )}`,
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
