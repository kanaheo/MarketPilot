import type {
  OrderApiItem,
  PortfolioDetailApiItem,
} from "@/types/marketpilot-api";
import type {
  PortfolioCashActivity,
  PortfolioHolding,
  PortfolioOrder,
} from "@/types/portfolio";

const HOLDING_COLORS = ["#0f766e", "#d97706", "#4f46e5", "#be123c", "#15803d"];

export type PortfolioPageData = Readonly<{
  name: string;
  currency: PortfolioDetailApiItem["base_currency"];
  currentCash: number;
  investedValue: number;
  totalValue: number;
  cashActivities: readonly PortfolioCashActivity[];
  holdings: readonly PortfolioHolding[];
}>;

function getHoldingColor(symbol: string): string {
  const colorIndex = Array.from(symbol).reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );

  return HOLDING_COLORS[colorIndex % HOLDING_COLORS.length];
}

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
      transaction.transaction_type === "FEE" ||
      transaction.transaction_type === "TRADE_BUY"
        ? amount
        : -amount;

    return activity;
  });
}

export function mapPortfolioPageData(
  detail: PortfolioDetailApiItem,
): PortfolioPageData {
  const currentCash = Number(detail.current_cash);
  const holdings = detail.holdings.map((holding) => ({
    averagePrice: Number(holding.average_price),
    color: getHoldingColor(holding.symbol),
    currency: holding.currency,
    currentPrice: Number(holding.current_price),
    marketValue: Number(holding.market_value),
    name: holding.symbol,
    quantity: Number(holding.quantity),
    returnRate: Number(holding.return_rate),
    symbol: holding.symbol,
  }));
  const investedValue = holdings.reduce(
    (total, holding) => total + holding.marketValue,
    0,
  );

  return {
    name: detail.name,
    currency: detail.base_currency,
    currentCash,
    investedValue,
    totalValue: currentCash + investedValue,
    cashActivities: mapCashActivities(
      currentCash,
      detail.recent_cash_transactions,
    ),
    holdings,
  };
}

export function mapPortfolioOrders(
  orders: readonly OrderApiItem[],
): readonly PortfolioOrder[] {
  return orders.map((order) => ({
    createdAt: order.created_at,
    currency: order.currency,
    id: order.id,
    limitPrice:
      order.limit_price === null ? null : Number(order.limit_price),
    orderType: order.order_type,
    quantity: Number(order.quantity),
    side: order.side,
    status: order.status,
    symbol: order.symbol,
  }));
}
