import { ClipboardList } from "lucide-react";

import {
  cancelOrderAction,
  executeOrderAction,
} from "@/app/[locale]/(dashboard)/portfolio/actions";
import { EmptyState } from "@/components/common/empty-state";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { formatMarketPrice, formatShortDate } from "@/lib/formatters";
import type { PortfolioOrdersProps } from "@/types/portfolio";

export function PortfolioOrders({
  locale,
  messages,
  orders,
  portfolioId,
}: PortfolioOrdersProps) {
  if (orders.length === 0) {
    return (
      <Panel className="portfolio-orders-panel">
        <SectionHeader
          description={messages.description}
          title={messages.title}
        />
        <EmptyState
          description={messages.empty.description}
          icon={ClipboardList}
          title={messages.empty.title}
        />
      </Panel>
    );
  }

  return (
    <Panel className="portfolio-orders-panel">
      <SectionHeader description={messages.description} title={messages.title} />
      <div className="portfolio-orders-table">
        <div className="portfolio-orders-row header" role="row">
          <span>{messages.columns.symbol}</span>
          <span>{messages.columns.side}</span>
          <span>{messages.columns.type}</span>
          <span>{messages.columns.quantity}</span>
          <span>{messages.columns.price}</span>
          <span>{messages.columns.status}</span>
          <span>{messages.columns.createdAt}</span>
          <span>{messages.columns.actions}</span>
        </div>
        {orders.map((order) => (
          <article className="portfolio-orders-row" key={order.id}>
            <strong>{order.symbol}</strong>
            <span>{messages.sides[order.side]}</span>
            <span>{messages.types[order.orderType]}</span>
            <span>{order.quantity.toLocaleString(locale)}</span>
            <span>
              {order.limitPrice === null
                ? messages.marketPrice
                : formatMarketPrice(
                    order.limitPrice,
                    order.currency,
                    locale,
                  )}
            </span>
            <span className={`order-status ${order.status.toLowerCase()}`}>
              {messages.statuses[order.status]}
            </span>
            <span>{formatShortDate(order.createdAt, locale)}</span>
            <div className="order-action-cell">
              {order.status === "PENDING" ? (
                <>
                  <form
                    action={executeOrderAction.bind(
                      null,
                      locale,
                      portfolioId,
                      order.id,
                    )}
                    className="order-execute-form"
                  >
                    <input
                      aria-label={messages.executePriceLabel}
                      defaultValue={order.limitPrice ?? ""}
                      min="0.0001"
                      name="price"
                      placeholder={messages.executePricePlaceholder}
                      step="0.0001"
                      type="number"
                    />
                    <button className="order-execute-button" type="submit">
                      {messages.execute}
                    </button>
                  </form>
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
                </>
              ) : (
                <span aria-hidden="true" className="order-action-placeholder">
                  -
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
