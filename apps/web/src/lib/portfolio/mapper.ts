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
const QUANTITY_INPUT_FORMAT_OPTIONS = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  useGrouping: false,
} as const satisfies Intl.NumberFormatOptions;

export type PortfolioPageData = Readonly<{
  name: string;
  currency: PortfolioDetailApiItem["base_currency"];
  currentCash: number;
  investedValue: number;
  netContributions: number;
  realizedProfitLoss: number;
  totalProfitLoss: number;
  totalReturnRate: number;
  totalValue: number;
  unrealizedProfitLoss: number;
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

function formatQuantityInputValue(quantity: string): string {
  const numericQuantity = Number(quantity);
  if (!Number.isFinite(numericQuantity)) {
    return quantity;
  }

  return numericQuantity.toLocaleString(
    "en-US",
    QUANTITY_INPUT_FORMAT_OPTIONS,
  );
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
  const investedValue = Number(detail.invested_value);
  const netContributions = Number(detail.net_contributions);
  const realizedProfitLoss = Number(detail.realized_profit_loss);
  const totalProfitLoss = Number(detail.total_profit_loss);
  const totalReturnRate = Number(detail.total_return_rate);
  const totalValue = Number(detail.total_value);
  const unrealizedProfitLoss = Number(detail.unrealized_profit_loss);
  const holdings = detail.holdings.map((holding) => ({
    averagePrice: Number(holding.average_price),
    color: getHoldingColor(holding.symbol),
    currency: holding.currency,
    currentPrice: Number(holding.current_price),
    marketValue: Number(holding.market_value),
    name: holding.symbol,
    quoteCurrency: holding.quote_currency,
    quantity: Number(holding.quantity),
    returnRate: Number(holding.return_rate),
    symbol: holding.symbol,
    unrealizedProfitLoss: Number(holding.unrealized_profit_loss),
    valuationCurrency: holding.valuation_currency,
    valuationFxRate: Number(holding.valuation_fx_rate),
  }));

  return {
    name: detail.name,
    currency: detail.base_currency,
    currentCash,
    investedValue,
    netContributions,
    realizedProfitLoss,
    totalProfitLoss,
    totalReturnRate,
    totalValue,
    unrealizedProfitLoss,
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
    displayPrice:
      order.execution_price === null
        ? order.limit_price === null
          ? null
          : Number(order.limit_price)
        : Number(order.execution_price),
    executedAt: order.executed_at,
    executionGrossAmount:
      order.execution_gross_amount === null
        ? null
        : Number(order.execution_gross_amount),
    id: order.id,
    limitPrice:
      order.limit_price === null ? null : Number(order.limit_price),
    orderType: order.order_type,
    quantity: Number(order.quantity),
    quantityInputValue: formatQuantityInputValue(order.quantity),
    side: order.side,
    status: order.status,
    symbol: order.symbol,
  }));
}
