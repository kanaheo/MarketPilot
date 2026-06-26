"use client";

import { useActionState } from "react";

import {
  cancelOrderAction,
  executeOrderFormAction,
  updateOrderAction,
} from "@/app/[locale]/(dashboard)/portfolio/actions";
import type { Locale } from "@/types/i18n";
import type { PortfolioMessages } from "@/types/i18n/portfolio";
import type {
  OrderExecuteActionResult,
  OrderUpdateActionResult,
  PortfolioOrder,
} from "@/types/portfolio";

const INITIAL_EXECUTE_RESULT: OrderExecuteActionResult = { ok: true };
const INITIAL_UPDATE_RESULT: OrderUpdateActionResult = { ok: true };

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
  const [updateResult, updateAction, isUpdating] = useActionState(
    updateOrderAction.bind(null, locale, portfolioId, order.id),
    INITIAL_UPDATE_RESULT,
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
      <form action={updateAction} className="order-update-form">
        <input
          aria-label={messages.updateQuantityLabel}
          defaultValue={order.quantity}
          min="0.00000001"
          name="quantity"
          step="0.00000001"
          type="number"
        />
        <button
          className="order-update-button"
          disabled={isUpdating}
          type="submit"
        >
          {messages.update}
        </button>
      </form>
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
      {!updateResult.ok ? (
        <p className="order-action-message" role="status">
          {messages.updateErrors[updateResult.reason]}
        </p>
      ) : null}
    </>
  );
}
