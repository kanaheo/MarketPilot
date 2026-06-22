import { SearchX, Star } from "lucide-react";

import { AssetMark } from "@/components/common/asset-mark";
import { EmptyState } from "@/components/common/empty-state";
import { Panel } from "@/components/common/panel";
import { Sparkline } from "@/components/common/sparkline";
import { TrendValue } from "@/components/common/trend-value";
import {
  formatCompactNumber,
  formatMarketPrice,
  formatPercent,
} from "@/lib/formatters";
import type { MarketTableProps } from "@/types/markets";

export function MarketTable({
  instruments,
  locale,
  messages,
  onSortChange,
  onToggleWatchlist,
  sort,
  watchlist,
}: MarketTableProps) {
  return (
    <Panel className="market-table-panel">
      <header className="market-table-heading">
        <div>
          <h2>{messages.title}</h2>
          <p>
            {messages.resultsPrefix} <strong>{instruments.length}</strong>{" "}
            {messages.resultsSuffix}
          </p>
        </div>
        <label>
          <span>{messages.sortLabel}</span>
          <select
            onChange={(event) =>
              onSortChange(event.target.value as MarketTableProps["sort"])
            }
            value={sort}
          >
            {messages.sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      {instruments.length > 0 ? (
        <div className="market-table" role="table" aria-label={messages.title}>
          <div className="market-table-row header" role="row">
            <span role="columnheader">{messages.columns.company}</span>
            <span role="columnheader">{messages.columns.market}</span>
            <span className="market-price" role="columnheader">
              {messages.columns.price}
            </span>
            <span role="columnheader">{messages.columns.change}</span>
            <span className="market-volume" role="columnheader">
              {messages.columns.volume}
            </span>
            <span className="market-trend" role="columnheader">
              {messages.columns.trend}
            </span>
            <span role="columnheader">{messages.columns.aiScore}</span>
            <span role="columnheader">{messages.columns.watchlist}</span>
          </div>

          {instruments.map((instrument) => (
            <div
              className="market-table-row"
              key={instrument.symbol}
              role="row"
            >
              <div className="asset-cell" role="cell">
                <AssetMark color={instrument.color} symbol={instrument.symbol} />
                <span>
                  <strong>{instrument.symbol}</strong>
                  <small>{instrument.name}</small>
                </span>
              </div>
              <div className="market-identity" role="cell">
                <strong>{messages.countries[instrument.country]}</strong>
                <small>
                  {instrument.exchange} ·{" "}
                  {messages.sessions[instrument.session]}
                </small>
              </div>
              <strong className="numeric-cell market-price" role="cell">
                {formatMarketPrice(
                  instrument.price,
                  instrument.currency,
                  locale,
                )}
              </strong>
              <span role="cell">
                <TrendValue value={instrument.changeRate}>
                  {formatPercent(instrument.changeRate, locale)}
                </TrendValue>
              </span>
              <span className="numeric-cell market-volume" role="cell">
                {formatCompactNumber(instrument.volume, locale)}
              </span>
              <span className="market-trend" role="cell">
                <Sparkline
                  points={instrument.sparkline}
                  positive={instrument.changeRate >= 0}
                />
              </span>
              <span className="ai-score-cell" role="cell">
                {instrument.aiScore === null ? (
                  <span className="ai-score-empty">{messages.noSignal}</span>
                ) : (
                  <strong>{Math.round(instrument.aiScore * 100)}</strong>
                )}
              </span>
              <span role="cell">
                <button
                  aria-label={
                    watchlist.has(instrument.symbol)
                      ? `${instrument.name} ${messages.removeWatchlist}`
                      : `${instrument.name} ${messages.addWatchlist}`
                  }
                  aria-pressed={watchlist.has(instrument.symbol)}
                  className="watchlist-toggle"
                  data-active={watchlist.has(instrument.symbol)}
                  onClick={() => onToggleWatchlist(instrument.symbol)}
                  type="button"
                >
                  <Star
                    fill={
                      watchlist.has(instrument.symbol)
                        ? "currentColor"
                        : "none"
                    }
                    size={17}
                    aria-hidden="true"
                  />
                </button>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          description={messages.empty.description}
          icon={SearchX}
          title={messages.empty.title}
        />
      )}
    </Panel>
  );
}
