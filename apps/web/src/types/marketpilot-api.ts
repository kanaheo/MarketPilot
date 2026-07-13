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
  quote_currency: SupportedCurrency;
  valuation_currency: SupportedCurrency;
  valuation_fx_rate: string;
  current_price_source: string;
  current_price_collected_at: string | null;
  valuation_fx_source: string;
  valuation_fx_collected_at: string | null;
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
  execution_gross_amount: string | null;
  executed_at: string | null;
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

export type MarketQuoteApiItem = Readonly<{
  symbol: string;
  currency: SupportedCurrency;
  current_price: string;
  source: string;
  collected_at: string | null;
}>;

export type MarketQuoteProviderStatusApiItem = Readonly<{
  configured_provider: string;
  active_provider: string;
  fallback_provider: string;
  finnhub_api_key_configured: boolean;
  cache_ttl_seconds: number;
}>;

export type MarketQuoteSnapshotFreshnessApiItem = Readonly<{
  symbol: string;
  currency: SupportedCurrency | null;
  has_snapshot: boolean;
  is_fresh: boolean;
  age_seconds: number | null;
  current_price: string | null;
  source: string | null;
  collected_at: string | null;
  created_at: string | null;
}>;

export type MarketDataSchedulerRunApiItem = Readonly<{
  id: string;
  job_name: string;
  status: "running" | "succeeded" | "failed";
  symbols_source: string;
  currency: SupportedCurrency | null;
  interval_policy: string;
  market_phase: string;
  next_interval_seconds: number;
  freshness_seconds: number | null;
  started_at: string;
  completed_at: string | null;
  requested_count: number;
  collectable_count: number;
  fresh_skipped_count: number;
  returned_count: number;
  stored_count: number;
  skipped_count: number;
  error_message: string | null;
  created_at: string;
}>;

export type MarketDataSchedulerRunStatusApiItem = Readonly<{
  latest_run: MarketDataSchedulerRunApiItem | null;
  recent_run_count: number;
  running_count: number;
  succeeded_count: number;
  failed_count: number;
}>;
