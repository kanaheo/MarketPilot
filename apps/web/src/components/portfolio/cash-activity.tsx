import { CircleDollarSign, ReceiptText, ShoppingCart } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { TrendValue } from "@/components/common/trend-value";
import { portfolioData } from "@/data/portfolio";
import { formatDollar, formatShortDate } from "@/lib/formatters";
import type { CashActivityProps } from "@/types/portfolio";

const activityIcons = {
  deposit: CircleDollarSign,
  purchase: ShoppingCart,
} as const;

export function CashActivity({ locale, messages }: CashActivityProps) {
  const hasActivity = portfolioData.cashActivity.length > 0;

  return (
    <Panel className="portfolio-detail-panel cash-activity-panel">
      <SectionHeader
        description={messages.description}
        title={messages.title}
      />

      {hasActivity ? (
        <div className="cash-activity-list">
          {portfolioData.cashActivity.map((activity) => {
            const Icon = activityIcons[activity.type];
            const content = messages.items[activity.key];

            return (
              <article className="cash-activity-item" key={activity.key}>
                <span className={`cash-activity-icon ${activity.type}`}>
                  <Icon size={17} aria-hidden="true" />
                </span>
                <div className="cash-activity-copy">
                  <strong>{content.title}</strong>
                  <span>{formatShortDate(activity.date, locale)}</span>
                </div>
                <div className="cash-activity-amount">
                  <TrendValue value={activity.amount}>
                    {formatDollar(activity.amount, locale)}
                  </TrendValue>
                  <small>
                    {messages.balance} {formatDollar(activity.balance, locale)}
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
