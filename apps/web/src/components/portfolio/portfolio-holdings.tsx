import { BriefcaseBusiness } from "lucide-react";

import { AssetMark } from "@/components/common/asset-mark";
import { EmptyState } from "@/components/common/empty-state";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { TrendValue } from "@/components/common/trend-value";
import { formatMarketPrice, formatPercent } from "@/lib/formatters";
import type { PortfolioHoldingsProps } from "@/types/portfolio";

const HOLDING_QUANTITY_FORMAT_OPTIONS = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
} as const satisfies Intl.NumberFormatOptions;

export function PortfolioHoldings({
  holdings,
  locale,
  messages,
}: PortfolioHoldingsProps) {
  const hasHoldings = holdings.length > 0;

  return (
    <Panel className="portfolio-holdings-panel">
      <SectionHeader
        description={messages.description}
        title={messages.title}
      />

      {hasHoldings ? (
        <div
          className="portfolio-holdings-table"
          role="table"
          aria-label={messages.title}
        >
          <div className="portfolio-holdings-row header" role="row">
            <span role="columnheader">{messages.columns.asset}</span>
            <span role="columnheader">{messages.columns.quantity}</span>
            <span className="average-price" role="columnheader">
              {messages.columns.averagePrice}
            </span>
            <span className="current-price" role="columnheader">
              {messages.columns.currentPrice}
            </span>
            <span role="columnheader">{messages.columns.marketValue}</span>
            <span role="columnheader">{messages.columns.returnRate}</span>
          </div>

          {holdings.map((holding) => (
            <div
              className="portfolio-holdings-row"
              key={holding.symbol}
              role="row"
            >
              <div className="asset-cell" role="cell">
                <AssetMark color={holding.color} symbol={holding.symbol} />
                <span>
                  <strong>{holding.symbol}</strong>
                  <small>{holding.name}</small>
                </span>
              </div>
              <span className="numeric-cell" role="cell">
                {holding.quantity.toLocaleString(
                  locale,
                  HOLDING_QUANTITY_FORMAT_OPTIONS,
                )}
                {messages.shareUnit}
              </span>
              <span className="numeric-cell average-price" role="cell">
                {formatMarketPrice(
                  holding.averagePrice,
                  holding.currency,
                  locale,
                )}
              </span>
              <span className="numeric-cell current-price" role="cell">
                {formatMarketPrice(
                  holding.currentPrice,
                  holding.currency,
                  locale,
                )}
              </span>
              <strong className="numeric-cell" role="cell">
                {formatMarketPrice(
                  holding.marketValue,
                  holding.currency,
                  locale,
                )}
              </strong>
              <span role="cell">
                <TrendValue value={holding.returnRate}>
                  {formatPercent(holding.returnRate, locale)}
                </TrendValue>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          description={messages.empty.description}
          icon={BriefcaseBusiness}
          title={messages.empty.title}
        />
      )}
    </Panel>
  );
}
