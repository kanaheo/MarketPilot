export type SupportedCurrency = "USD" | "KRW" | "JPY";

export type CashTransactionType =
  | "INITIAL_DEPOSIT"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "FEE"
  | "DIVIDEND";

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

export type PortfolioDetailApiItem = PortfolioApiItem &
  Readonly<{
    recent_cash_transactions: readonly CashTransactionApiItem[];
    holdings: readonly unknown[];
    orders: readonly unknown[];
  }>;
