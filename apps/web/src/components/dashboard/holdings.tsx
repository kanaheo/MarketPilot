import { BriefcaseBusiness } from "lucide-react";

import { AssetMark } from "@/components/common/asset-mark";
import { EmptyState } from "@/components/common/empty-state";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { TrendValue } from "@/components/common/trend-value";
import { dashboardData } from "@/data/dashboard";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import type { HoldingsProps } from "@/types/dashboard";

export function Holdings({ locale, messages }: HoldingsProps) {
  const hasHoldings = dashboardData.holdings.length > 0;

  return (
    <Panel className="compact-panel holdings-panel">
      <SectionHeader
        actionLabel={messages.viewPortfolio}
        description={messages.description}
        title={messages.title}
      />

      {hasHoldings ? (
        <>
          <div className="data-list" role="table" aria-label={messages.title}>
            <div className="data-list-header holdings-columns" role="row">
              <span>{messages.columns.symbol}</span>
              <span>{messages.columns.quantity}</span>
              <span>{messages.columns.value}</span>
              <span>{messages.columns.returnRate}</span>
            </div>
            {dashboardData.holdings.map((item) => (
              <div
                className="data-list-row holdings-columns"
                role="row"
                key={item.symbol}
              >
                <div className="asset-cell">
                  <AssetMark color={item.color} symbol={item.symbol} />
                  <span>
                    <strong>{item.symbol}</strong>
                    <small>{item.name}</small>
                  </span>
                </div>
                <span className="numeric-cell">
                  {item.quantity}
                  {messages.shareUnit}
                </span>
                <strong className="numeric-cell">
                  {formatCurrency(item.value, locale)}
                </strong>
                <TrendValue value={item.returnRate}>
                  {formatPercent(item.returnRate, locale)}
                </TrendValue>
              </div>
            ))}
          </div>

          <button className="panel-footer-action" type="button">
            {messages.viewAll}
          </button>
        </>
      ) : (
        <EmptyState
          actionLabel={messages.empty.action}
          description={messages.empty.description}
          icon={BriefcaseBusiness}
          title={messages.empty.title}
        />
      )}
    </Panel>
  );
}
