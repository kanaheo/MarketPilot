"use server";

import { revalidatePath } from "next/cache";

import { assertLocale } from "@/i18n/config";
import { MarketPilotApiError } from "@/lib/server/marketpilot-api";
import {
  createCashTransaction,
  createOrder,
  createPortfolio,
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
  OrderFailureReason,
  PortfolioCreateActionResult,
  PortfolioCreateFailureReason,
} from "@/types/portfolio";

function getCreatePortfolioFailureReason(
  error: unknown,
): PortfolioCreateFailureReason {
  if (error instanceof MarketPilotApiError) {
    if (error.status === 401 || error.status === 403) {
      return "unauthorized";
    }

    if (error.status === 409) {
      return "conflict";
    }

    if (error.status === 422) {
      return "invalid";
    }
  }

  return "unknown";
}

function getCashTransactionFailureReason(
  error: unknown,
): CashTransactionFailureReason {
  if (error instanceof MarketPilotApiError) {
    if (error.status === 401 || error.status === 403) {
      return "unauthorized";
    }

    if (error.status === 404) {
      return "notFound";
    }

    if (error.status === 409) {
      return "conflict";
    }

    if (error.status === 422) {
      return "invalid";
    }
  }

  return "unknown";
}

function getOrderFailureReason(error: unknown): OrderFailureReason {
  if (error instanceof MarketPilotApiError) {
    if (error.status === 401 || error.status === 403) {
      return "unauthorized";
    }

    if (error.status === 404) {
      return "notFound";
    }

    if (error.status === 422) {
      return "invalid";
    }
  }

  return "unknown";
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
