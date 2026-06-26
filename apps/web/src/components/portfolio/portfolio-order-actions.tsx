"use client";

import { useActionState } from "react";

import {
  cancelOrderAction,
  executeOrderFormAction,
} from "@/app/[locale]/(dashboard)/portfolio/actions";
import type { Locale } from "@/types/i18n";
import type { PortfolioMessages } from "@/types/i18n/portfolio";
import type {
  OrderExecuteActionResult,
  PortfolioOrder,
} from "@/types/portfolio";

const INITIAL_EXECUTE_RESULT: OrderExecuteActionResult = { ok: true };

type PortfolioOrderActionsProps = Readonly<{
  locale: Locale;
  messages: PortfolioMessages["orders"];
  order: PortfolioOrder;
  portfolioId: string;
}>;

export function PortfolioOrderActions({
  locale,
  messages,
  order,
  portfolioId,
}: PortfolioOrderActionsProps) {
  const [executionResult, executeAction, isExecuting] = useActionState(
    executeOrderFormAction.bind(null, locale, portfolioId, order.id),
    INITIAL_EXECUTE_RESULT,
  );

  if (order.status !== "PENDING") {
    return (
      <span aria-hidden="true" className="order-action-placeholder">
        -
      </span>
    );
  }

  return (
    <>
      <form action={executeAction} className="order-execute-form">
        <input
          aria-label={messages.executePriceLabel}
          defaultValue={order.limitPrice ?? ""}
          min="0.0001"
          name="price"
          placeholder={messages.executePricePlaceholder}
          step="0.0001"
          type="number"
        />
        <button
          className="order-execute-button"
          disabled={isExecuting}
          type="submit"
        >
          {messages.execute}
        </button>
      </form>
      <form
        action={cancelOrderAction.bind(null, locale, portfolioId, order.id)}
      >
        <button className="order-cancel-button" type="submit">
          {messages.cancel}
        </button>
      </form>
      {!executionResult.ok ? (
        <p className="order-action-message" role="status">
          {messages.executeErrors[executionResult.reason]}
        </p>
      ) : null}
    </>
  );
}
