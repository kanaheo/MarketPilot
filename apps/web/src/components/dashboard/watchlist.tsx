import { RefreshCw, Star } from "lucide-react";

import { AssetMark } from "@/components/common/asset-mark";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { TrendValue } from "@/components/common/trend-value";
import { dashboardData } from "@/data/dashboard";
import { formatDollar, formatPercent } from "@/lib/formatters";
import type { WatchlistProps } from "@/types/dashboard";

function Sparkline({
  points,
  positive,
}: Readonly<{ points: readonly number[]; positive: boolean }>) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const path = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 28 - ((point - min) / range) * 24;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg className="sparkline" viewBox="0 0 100 32" aria-hidden="true">
      <path
        d={path}
        fill="none"
        stroke={positive ? "#16796f" : "#db4d52"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function Watchlist({ locale, messages }: WatchlistProps) {
  return (
    <Panel className="watchlist-panel">
      <SectionHeader
        icon={Star}
        meta={messages.updated}
        title={messages.title}
      />

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
          <div className="data-list-row watchlist-columns" role="row" key={item.symbol}>
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
            <Sparkline points={item.sparkline} positive={item.change >= 0} />
          </div>
        ))}
      </div>

      <button className="panel-footer-action" type="button">
        {messages.manage}
      </button>
    </Panel>
  );
}
