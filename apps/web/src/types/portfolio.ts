import type { Locale } from "@/types/i18n";
import type { PortfolioMessages } from "@/types/i18n/portfolio";
import type {
  CashTransactionFormValues,
  OrderFormValues,
  PortfolioCreateFormValues,
} from "@/lib/validation/portfolios";
import type {
  CashTransactionType,
  OrderSide,
  OrderStatus,
  OrderType,
  SupportedCurrency,
} from "@/types/marketpilot-api";

export type PortfolioPageProps = Readonly<{
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    portfolioId?: string;
  }>;
}>;

export type PortfolioHeaderProps = Readonly<{
  messages: PortfolioMessages["header"];
  portfolioName?: string;
}>;

export type PortfolioCreateFailureReason =
  | "conflict"
  | "invalid"
  | "unauthorized"
  | "unknown";

export type PortfolioCreateActionResult =
  | Readonly<{
      ok: true;
    }>
  | Readonly<{
      ok: false;
      reason: PortfolioCreateFailureReason;
    }>;

export type PortfolioCreateFormProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["createForm"];
}>;

export type PortfolioCreateFormSubmission = Readonly<{
  message: string;
  status: "error" | "idle" | "success";
}>;

export type PortfolioCreateSubmitHandler = (
  values: PortfolioCreateFormValues,
) => Promise<void>;

export type CashTransactionFailureReason =
  | "conflict"
  | "invalid"
  | "notFound"
  | "unauthorized"
  | "unknown";

export type CashTransactionActionResult =
  | Readonly<{
      ok: true;
    }>
  | Readonly<{
      ok: false;
      reason: CashTransactionFailureReason;
    }>;

export type CashTransactionFormProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["cashTransactionForm"];
  portfolioId: string;
}>;

export type CashTransactionFormSubmission = Readonly<{
  message: string;
  status: "error" | "idle" | "success";
}>;

export type CashTransactionSubmitHandler = (
  values: CashTransactionFormValues,
) => Promise<void>;

export type OrderFailureReason =
  | "invalid"
  | "notFound"
  | "unauthorized"
  | "unknown";

export type OrderActionResult =
  | Readonly<{
      ok: true;
    }>
  | Readonly<{
      ok: false;
      reason: OrderFailureReason;
    }>;

export type OrderFormProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["orderForm"];
  portfolioId: string;
}>;

export type OrderFormSubmission = Readonly<{
  message: string;
  status: "error" | "idle" | "success";
}>;

export type OrderSubmitHandler = (values: OrderFormValues) => Promise<void>;

export type PortfolioOrdersProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["orders"];
  orders: readonly PortfolioOrder[];
  portfolioId: string;
}>;

export type PortfolioSelectorProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["selector"];
  portfolios: readonly PortfolioSelectorItem[];
  selectedPortfolioId: string;
}>;

export type PortfolioSelectorItem = Readonly<{
  currentCash: number;
  currency: SupportedCurrency;
  id: string;
  name: string;
}>;

export type PortfolioSummaryProps = Readonly<{
  currency: SupportedCurrency;
  currentCash: number;
  locale: Locale;
  messages: PortfolioMessages["summary"];
}>;

export type PortfolioValueChartProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["valueChart"];
}>;

export type AssetAllocationProps = Readonly<{
  currency: SupportedCurrency;
  currentCash: number;
  locale: Locale;
  messages: PortfolioMessages["allocation"];
}>;

export type PortfolioHoldingsProps = Readonly<{
  holdings: readonly PortfolioHolding[];
  locale: Locale;
  messages: PortfolioMessages["holdings"];
}>;

export type CashActivityProps = Readonly<{
  activities: readonly PortfolioCashActivity[];
  locale: Locale;
  messages: PortfolioMessages["cashActivity"];
}>;

export type RiskOverviewProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["risk"];
}>;

export type PortfolioHolding = Readonly<{
  symbol: string;
  name: string;
  currency: SupportedCurrency;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  returnRate: number;
  color: string;
}>;

export type PortfolioCashActivity = Readonly<{
  id: string;
  type: CashTransactionType;
  occurredAt: string;
  amount: number;
  balance: number;
  currency: SupportedCurrency;
  note: string | null;
}>;

export type PortfolioOrder = Readonly<{
  createdAt: string;
  currency: SupportedCurrency;
  id: string;
  limitPrice: number | null;
  orderType: OrderType;
  quantity: number;
  side: OrderSide;
  status: OrderStatus;
  symbol: string;
}>;
