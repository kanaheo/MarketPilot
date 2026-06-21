import { BriefcaseBusiness } from "lucide-react";

import { AssetMark } from "@/components/common/asset-mark";
import { EmptyState } from "@/components/common/empty-state";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { TrendValue } from "@/components/common/trend-value";
import { portfolioData } from "@/data/portfolio";
import { formatDollar, formatPercent } from "@/lib/formatters";
import type { PortfolioHoldingsProps } from "@/types/portfolio";

export function PortfolioHoldings({
  locale,
  messages,
}: PortfolioHoldingsProps) {
  const hasHoldings = portfolioData.holdings.length > 0;

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
            <span>{messages.columns.asset}</span>
            <span>{messages.columns.quantity}</span>
            <span>{messages.columns.averagePrice}</span>
            <span>{messages.columns.currentPrice}</span>
            <span>{messages.columns.marketValue}</span>
            <span>{messages.columns.returnRate}</span>
          </div>

          {portfolioData.holdings.map((holding) => (
            <div
              className="portfolio-holdings-row"
              key={holding.symbol}
              role="row"
            >
              <div className="asset-cell">
                <AssetMark color={holding.color} symbol={holding.symbol} />
                <span>
                  <strong>{holding.symbol}</strong>
                  <small>{holding.name}</small>
                </span>
              </div>
              <span className="numeric-cell">
                {holding.quantity}
                {messages.shareUnit}
              </span>
              <span className="numeric-cell average-price">
                {formatDollar(holding.averagePrice, locale)}
              </span>
              <span className="numeric-cell current-price">
                {formatDollar(holding.currentPrice, locale)}
              </span>
              <strong className="numeric-cell">
                {formatDollar(holding.marketValue, locale)}
              </strong>
              <TrendValue value={holding.returnRate}>
                {formatPercent(holding.returnRate, locale)}
              </TrendValue>
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
