"use server";

import { revalidatePath } from "next/cache";

import { assertLocale } from "@/i18n/config";
import { getMarketPilotActionFailureReason } from "@/lib/server/action-errors";
import {
  cancelOrder,
  createCashTransaction,
  createOrder,
  createPortfolio,
  executeOrder,
} from "@/lib/server/portfolio-api";
import type {
  CashTransactionFormValues,
  OrderFormValues,
  PortfolioCreateFormValues,
} from "@/lib/validation/portfolios";
import type { Locale } from "@/types/i18n";
import type {
  CashTransactionActionResult,
  CashTransactionFailureReason,
  OrderActionResult,
  OrderExecuteActionResult,
  OrderExecuteFailureReason,
  OrderFailureReason,
  PortfolioCreateActionResult,
  PortfolioCreateFailureReason,
} from "@/types/portfolio";

const CREATE_PORTFOLIO_FAILURE_REASONS = {
  401: "unauthorized",
  403: "unauthorized",
  409: "conflict",
  422: "invalid",
} as const satisfies Readonly<Partial<Record<number, PortfolioCreateFailureReason>>>;

const CASH_TRANSACTION_FAILURE_REASONS = {
  401: "unauthorized",
  403: "unauthorized",
  404: "notFound",
  409: "conflict",
  422: "invalid",
} as const satisfies Readonly<Partial<Record<number, CashTransactionFailureReason>>>;

const ORDER_FAILURE_REASONS = {
  401: "unauthorized",
  403: "unauthorized",
  404: "notFound",
  422: "invalid",
} as const satisfies Readonly<Partial<Record<number, OrderFailureReason>>>;

const ORDER_EXECUTE_FAILURE_REASONS = {
  401: "unauthorized",
  403: "unauthorized",
  404: "notFound",
  409: "conflict",
  422: "invalid",
} as const satisfies Readonly<Partial<Record<number, OrderExecuteFailureReason>>>;

function getCreatePortfolioFailureReason(
  error: unknown,
): PortfolioCreateFailureReason {
  return getMarketPilotActionFailureReason(
    error,
    CREATE_PORTFOLIO_FAILURE_REASONS,
    "unknown",
  );
}

function getCashTransactionFailureReason(
  error: unknown,
): CashTransactionFailureReason {
  return getMarketPilotActionFailureReason(
    error,
    CASH_TRANSACTION_FAILURE_REASONS,
    "unknown",
  );
}

function getOrderFailureReason(error: unknown): OrderFailureReason {
  return getMarketPilotActionFailureReason(
    error,
    ORDER_FAILURE_REASONS,
    "unknown",
  );
}

function getOrderExecuteFailureReason(
  error: unknown,
): OrderExecuteFailureReason {
  return getMarketPilotActionFailureReason(
    error,
    ORDER_EXECUTE_FAILURE_REASONS,
    "unknown",
  );
}

export async function createPortfolioAction(
  locale: Locale,
  values: PortfolioCreateFormValues,
): Promise<PortfolioCreateActionResult> {
  assertLocale(locale);

  try {
    await createPortfolio({
      name: values.name,
      base_currency: values.baseCurrency,
      initial_capital: String(values.initialCapital),
    });
    revalidatePath(`/${locale}/portfolio`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: getCreatePortfolioFailureReason(error),
    };
  }
}

export async function createOrderAction(
  locale: Locale,
  portfolioId: string,
  values: OrderFormValues,
): Promise<OrderActionResult> {
  assertLocale(locale);

  try {
    await createOrder(portfolioId, {
      decision_evidence: values.decisionEvidence?.trim() || null,
      limit_price:
        values.orderType === "LIMIT" && values.limitPrice !== undefined
          ? String(values.limitPrice)
          : null,
      order_type: values.orderType,
      quantity: String(values.quantity),
      side: values.side,
      symbol: values.symbol.trim().toUpperCase(),
    });
    revalidatePath(`/${locale}/portfolio`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: getOrderFailureReason(error),
    };
  }
}

export async function createCashTransactionAction(
  locale: Locale,
  portfolioId: string,
  values: CashTransactionFormValues,
): Promise<CashTransactionActionResult> {
  assertLocale(locale);

  try {
    await createCashTransaction(portfolioId, {
      amount: String(values.amount),
      note: values.note?.trim() || null,
      occurred_at: new Date().toISOString(),
      transaction_type: values.transactionType,
    });
    revalidatePath(`/${locale}/portfolio`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: getCashTransactionFailureReason(error),
    };
  }
}

export async function cancelOrderAction(
  locale: Locale,
  portfolioId: string,
  orderId: string,
): Promise<void> {
  assertLocale(locale);

  try {
    await cancelOrder(portfolioId, orderId);
    revalidatePath(`/${locale}/portfolio`);
  } catch {
    return;
  }
}

export async function executeOrderAction(
  locale: Locale,
  portfolioId: string,
  orderId: string,
  _previousState: OrderExecuteActionResult,
  formData: FormData,
): Promise<OrderExecuteActionResult> {
  assertLocale(locale);

  const price = Number(formData.get("price"));
  if (!Number.isFinite(price) || price <= 0) {
    return {
      ok: false,
      reason: "invalid",
    };
  }

  try {
    await executeOrder(portfolioId, orderId, {
      price: String(price),
    });
    revalidatePath(`/${locale}/portfolio`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: getOrderExecuteFailureReason(error),
    };
  }
}

export async function executeOrderFormAction(
  locale: Locale,
  portfolioId: string,
  orderId: string,
  previousState: OrderExecuteActionResult,
  formData: FormData,
): Promise<OrderExecuteActionResult> {
  return executeOrderAction(
    locale,
    portfolioId,
    orderId,
    previousState,
    formData,
  );
}
