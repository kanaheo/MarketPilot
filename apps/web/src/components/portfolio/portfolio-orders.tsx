"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Panel } from "@/components/common/panel";
import { PortfolioOrderActions } from "@/components/portfolio/portfolio-order-actions";
import { SectionHeader } from "@/components/common/section-header";
import { formatMarketPrice, formatShortDate } from "@/lib/formatters";
import type { PortfolioOrdersProps } from "@/types/portfolio";

const ORDER_QUANTITY_FORMAT_OPTIONS = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
} as const satisfies Intl.NumberFormatOptions;
const ORDERS_PER_PAGE = 10;

export function PortfolioOrders({
  locale,
  messages,
  orders,
  portfolioId,
}: PortfolioOrdersProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const visibleOrders = useMemo(() => {
    const startIndex = (activePage - 1) * ORDERS_PER_PAGE;
    return orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);
  }, [activePage, orders]);

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
          <span>{messages.columns.amount}</span>
          <span>{messages.columns.status}</span>
          <span>{messages.columns.createdAt}</span>
          <span>{messages.columns.actions}</span>
        </div>
        {visibleOrders.map((order) => (
          <article className="portfolio-orders-row" key={order.id}>
            <strong>{order.symbol}</strong>
            <span>{messages.sides[order.side]}</span>
            <span>{messages.types[order.orderType]}</span>
            <span>
              {order.quantity.toLocaleString(
                locale,
                ORDER_QUANTITY_FORMAT_OPTIONS,
              )}
            </span>
            <span>
              {order.displayPrice === null
                ? messages.marketPrice
                : formatMarketPrice(
                    order.displayPrice,
                    order.currency,
                    locale,
                  )}
            </span>
            <span>
              {order.executionGrossAmount === null
                ? "-"
                : formatMarketPrice(
                    order.executionGrossAmount,
                    order.currency,
                    locale,
                  )}
            </span>
            <span className={`order-status ${order.status.toLowerCase()}`}>
              {messages.statuses[order.status]}
            </span>
            <span>
              {formatShortDate(order.executedAt ?? order.createdAt, locale)}
            </span>
            <div className="order-action-cell">
              <PortfolioOrderActions
                key={`${order.id}-${order.quantityInputValue}-${order.status}`}
                locale={locale}
                messages={messages}
                order={order}
                portfolioId={portfolioId}
              />
            </div>
          </article>
        ))}
      </div>
      {totalPages > 1 ? (
        <nav
          className="portfolio-orders-pagination"
          aria-label={messages.pagination.label}
        >
          <button
            aria-label={messages.pagination.previous}
            disabled={activePage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            type="button"
          >
            <ChevronLeft size={15} aria-hidden="true" />
          </button>
          <span>
            {messages.pagination.status
              .replace("{current}", String(activePage))
              .replace("{total}", String(totalPages))}
          </span>
          <button
            aria-label={messages.pagination.next}
            disabled={activePage === totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            type="button"
          >
            <ChevronRight size={15} aria-hidden="true" />
          </button>
        </nav>
      ) : null}
    </Panel>
  );
}
