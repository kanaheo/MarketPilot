import { RefreshCw, Star } from "lucide-react";

import { AssetMark } from "@/components/common/asset-mark";
import { EmptyState } from "@/components/common/empty-state";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { Sparkline } from "@/components/common/sparkline";
import { TrendValue } from "@/components/common/trend-value";
import { dashboardData } from "@/data/dashboard";
import { formatDollar, formatPercent } from "@/lib/formatters";
import type { WatchlistProps } from "@/types/dashboard";

export function Watchlist({ locale, messages }: WatchlistProps) {
  const hasWatchlistItems = dashboardData.watchlist.length > 0;

  return (
    <Panel className="watchlist-panel">
      <SectionHeader
        icon={Star}
        meta={messages.updated}
        title={messages.title}
      />

      {hasWatchlistItems ? (
        <>
          <div className="watchlist-refresh">
            <RefreshCw size={13} aria-hidden="true" />
            <span>{messages.realtime}</span>
          </div>

          <div className="data-list" role="table" aria-label={messages.title}>
            <div className="data-list-header watchlist-columns" role="row">
              <span>{messages.columns.symbol}</span>
              <span>{messages.columns.price}</span>
              <span>{messages.columns.change}</span>
              <span>{messages.columns.trend}</span>
            </div>
            {dashboardData.watchlist.map((item) => (
              <div
                className="data-list-row watchlist-columns"
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
                <strong className="numeric-cell">
                  {formatDollar(item.price, locale)}
                </strong>
                <TrendValue value={item.change}>
                  {formatPercent(item.change, locale)}
                </TrendValue>
                <Sparkline
                  points={item.sparkline}
                  positive={item.change >= 0}
                />
              </div>
            ))}
          </div>

          <button className="panel-footer-action" type="button">
            {messages.manage}
          </button>
        </>
      ) : (
        <EmptyState
          actionLabel={messages.empty.action}
          description={messages.empty.description}
          icon={Star}
          title={messages.empty.title}
        />
      )}
    </Panel>
  );
}
