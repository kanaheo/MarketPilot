import type { PortfolioDetailApiItem } from "@/types/marketpilot-api";
import type { PortfolioCashActivity } from "@/types/portfolio";

export type PortfolioPageData = Readonly<{
  name: string;
  currency: PortfolioDetailApiItem["base_currency"];
  currentCash: number;
  cashActivities: readonly PortfolioCashActivity[];
}>;

function mapCashActivities(
  currentCash: number,
  transactions: PortfolioDetailApiItem["recent_cash_transactions"],
): readonly PortfolioCashActivity[] {
  let balance = currentCash;

  return transactions.map((transaction) => {
    const amount = Number(transaction.amount);
    const activity = {
      id: transaction.id,
      type: transaction.transaction_type,
      occurredAt: transaction.occurred_at,
      amount,
      balance,
      currency: transaction.currency,
      note: transaction.note,
    };

    balance +=
      transaction.transaction_type === "WITHDRAWAL" ||
      transaction.transaction_type === "FEE"
        ? amount
        : -amount;

    return activity;
  });
}

export function mapPortfolioPageData(
  detail: PortfolioDetailApiItem,
): PortfolioPageData {
  const currentCash = Number(detail.current_cash);

  return {
    name: detail.name,
    currency: detail.base_currency,
    currentCash,
    cashActivities: mapCashActivities(
      currentCash,
      detail.recent_cash_transactions,
    ),
  };
}
