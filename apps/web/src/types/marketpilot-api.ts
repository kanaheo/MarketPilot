export type SupportedCurrency = "USD" | "KRW" | "JPY";

export type CashTransactionType =
  | "INITIAL_DEPOSIT"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "FEE"
  | "DIVIDEND"
  | "TRADE_BUY"
  | "TRADE_SELL";

export type UserCashTransactionType = "DEPOSIT" | "WITHDRAWAL";
export type OrderSide = "BUY" | "SELL";
export type OrderType = "MARKET" | "LIMIT";
export type OrderStatus = "CANCELLED" | "FILLED" | "PENDING" | "REJECTED";

export type PortfolioApiItem = Readonly<{
  id: string;
  name: string;
  base_currency: SupportedCurrency;
  current_cash: string;
  created_at: string;
  updated_at: string;
}>;

export type CashTransactionApiItem = Readonly<{
  id: string;
  transaction_type: CashTransactionType;
  amount: string;
  currency: SupportedCurrency;
  occurred_at: string;
  note: string | null;
  created_at: string;
}>;

export type PortfolioHoldingApiItem = Readonly<{
  symbol: string;
  quantity: string;
  average_price: string;
  current_price: string;
  market_value: string;
  unrealized_profit_loss: string;
  return_rate: string;
  currency: SupportedCurrency;
}>;

export type PortfolioDetailApiItem = PortfolioApiItem &
  Readonly<{
    invested_value: string;
    net_contributions: string;
    realized_profit_loss: string;
    total_profit_loss: string;
    total_return_rate: string;
    total_value: string;
    unrealized_profit_loss: string;
    recent_cash_transactions: readonly CashTransactionApiItem[];
    holdings: readonly PortfolioHoldingApiItem[];
    orders: readonly unknown[];
  }>;

export type PortfolioCreateApiRequest = Readonly<{
  name: string;
  base_currency: SupportedCurrency;
  initial_capital: string;
}>;

export type CashTransactionCreateApiRequest = Readonly<{
  transaction_type: UserCashTransactionType;
  amount: string;
  occurred_at: string;
  note: string | null;
}>;

export type OrderApiItem = Readonly<{
  id: string;
  portfolio_id: string;
  symbol: string;
  side: OrderSide;
  order_type: OrderType;
  quantity: string;
  limit_price: string | null;
  execution_price: string | null;
  currency: SupportedCurrency;
  status: OrderStatus;
  strategy_version: string;
  decision_evidence: string;
  created_at: string;
  updated_at: string;
}>;

export type OrderCreateApiRequest = Readonly<{
  symbol: string;
  side: OrderSide;
  order_type: OrderType;
  quantity: string;
  limit_price: string | null;
  decision_evidence: string | null;
}>;

export type OrderExecuteApiRequest = Readonly<{
  price: string;
  executed_at?: string;
}>;

export type OrderUpdateApiRequest = Readonly<{
  quantity: string;
}>;
