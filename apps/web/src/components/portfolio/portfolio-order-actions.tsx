"use client";

import { useActionState } from "react";

import {
  cancelOrderAction,
  deleteOrderAction,
  executeOrderFormAction,
  updateOrderAction,
} from "@/app/[locale]/(dashboard)/portfolio/actions";
import {
  ORDER_QUANTITY_INPUT_MIN,
  ORDER_QUANTITY_INPUT_STEP,
  sanitizeOrderQuantityInput,
} from "@/lib/portfolio/order-quantity";
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

  const isPending = order.status === "PENDING";
  const canDelete = order.status !== "FILLED";

  if (!isPending && !canDelete) {
    return (
      <span aria-hidden="true" className="order-action-placeholder">
        -
      </span>
    );
  }

  return (
    <>
      {isPending ? (
        <>
          <div className="order-action-grid">
            <form action={updateAction} className="order-update-form">
              <input
                aria-label={messages.updateQuantityLabel}
                defaultValue={order.quantityInputValue}
                min={ORDER_QUANTITY_INPUT_MIN}
                name="quantity"
                onInput={sanitizeOrderQuantityInput}
                step={ORDER_QUANTITY_INPUT_STEP}
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
            <div className="order-secondary-actions">
              <form
                action={cancelOrderAction.bind(
                  null,
                  locale,
                  portfolioId,
                  order.id,
                )}
              >
                <button className="order-cancel-button" type="submit">
                  {messages.cancel}
                </button>
              </form>
            </div>
          </div>
        </>
      ) : null}
      {canDelete && !isPending ? (
        <div className="order-secondary-actions">
          <form
            action={deleteOrderAction.bind(null, locale, portfolioId, order.id)}
          >
            <button className="order-delete-button" type="submit">
              {messages.delete}
            </button>
          </form>
        </div>
      ) : null}
      {!executionResult.ok && isPending ? (
        <p className="order-action-message" role="status">
          {messages.executeErrors[executionResult.reason]}
        </p>
      ) : null}
      {!updateResult.ok && isPending ? (
        <p className="order-action-message" role="status">
          {messages.updateErrors[updateResult.reason]}
        </p>
      ) : null}
    </>
  );
}
