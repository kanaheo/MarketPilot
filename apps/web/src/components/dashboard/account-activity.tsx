import { ArrowDownLeft, ArrowUpRight, MoreHorizontal } from "lucide-react";

import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { TrendValue } from "@/components/common/trend-value";
import { dashboardData } from "@/data/dashboard";
import { formatCurrency } from "@/lib/formatters";
import type { AccountActivityProps } from "@/types/dashboard";

const activityIcons = {
  buy: ArrowUpRight,
  deposit: ArrowDownLeft,
  sell: ArrowDownLeft,
};

export function AccountActivity({ locale, messages }: AccountActivityProps) {
  return (
    <Panel className="compact-panel activity-panel">
      <div className="activity-heading">
        <SectionHeader
          description={messages.description}
          title={messages.title}
        />
        <button className="plain-icon-button" type="button" aria-label={messages.more}>
          <MoreHorizontal size={19} />
        </button>
      </div>

      <div className="activity-list">
        {dashboardData.activity.map((activity) => {
          const Icon = activityIcons[activity.type];
          const content = messages.items[activity.key];

          return (
            <article className="activity-item" key={activity.key}>
              <span className={`activity-icon ${activity.type}`}>
                <Icon size={17} aria-hidden="true" />
              </span>
              <div className="activity-copy">
                <strong>{content.title}</strong>
                <span>
                  {activity.date} · {content.detail}
                </span>
              </div>
              <TrendValue value={activity.amount}>
                {formatCurrency(activity.amount, locale, {
                  signDisplay: "exceptZero",
                })}
              </TrendValue>
            </article>
          );
        })}
      </div>

      <button className="panel-footer-action" type="button">
        {messages.viewAll}
      </button>
    </Panel>
  );
}
