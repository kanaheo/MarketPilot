import {
  CircleDollarSign,
  ReceiptText,
  WalletCards,
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { TrendValue } from "@/components/common/trend-value";
import {
  formatMarketPrice,
  formatMarketPriceDelta,
  formatShortDate,
} from "@/lib/formatters";
import type { CashTransactionType } from "@/types/marketpilot-api";
import type { CashActivityProps } from "@/types/portfolio";

const activityIcons: Record<CashTransactionType, typeof CircleDollarSign> = {
  DEPOSIT: CircleDollarSign,
  DIVIDEND: CircleDollarSign,
  FEE: WalletCards,
  INITIAL_DEPOSIT: CircleDollarSign,
  TRADE_BUY: WalletCards,
  TRADE_SELL: CircleDollarSign,
  WITHDRAWAL: WalletCards,
};

const negativeActivityTypes = new Set<CashTransactionType>([
  "FEE",
  "TRADE_BUY",
  "WITHDRAWAL",
]);

export function CashActivity({
  activities,
  locale,
  messages,
}: CashActivityProps) {
  const hasActivity = activities.length > 0;

  return (
    <Panel className="portfolio-detail-panel cash-activity-panel">
      <SectionHeader
        description={messages.description}
        title={messages.title}
      />

      {hasActivity ? (
        <div className="cash-activity-list">
          {activities.map((activity, activityIndex) => {
            const Icon = activityIcons[activity.type];
            const amount = negativeActivityTypes.has(activity.type)
              ? -activity.amount
              : activity.amount;
            const isLatestActivity = activityIndex === 0;

            return (
              <article
                className={`cash-activity-item ${
                  isLatestActivity ? "latest" : ""
                }`}
                key={activity.id}
              >
                <span
                  className={`cash-activity-icon ${
                    amount < 0 ? "purchase" : "deposit"
                  }`}
                >
                  <Icon size={17} aria-hidden="true" />
                </span>
                <div className="cash-activity-copy">
                  <strong>{messages.items[activity.type]}</strong>
                  <span>{formatShortDate(activity.occurredAt, locale)}</span>
                </div>
                <div className="cash-activity-amount">
                  <TrendValue value={amount}>
                    {formatMarketPriceDelta(amount, activity.currency, locale)}
                  </TrendValue>
                  <small>
                    {messages.balance}{" "}
                    {formatMarketPrice(
                      activity.balance,
                      activity.currency,
                      locale,
                    )}
                  </small>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          description={messages.empty.description}
          icon={ReceiptText}
          title={messages.empty.title}
        />
      )}
    </Panel>
  );
}
