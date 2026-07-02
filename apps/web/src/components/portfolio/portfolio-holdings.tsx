import { BriefcaseBusiness } from "lucide-react";

import { AssetMark } from "@/components/common/asset-mark";
import { EmptyState } from "@/components/common/empty-state";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { TrendValue } from "@/components/common/trend-value";
import { HoldingChangeValue } from "@/components/portfolio/holding-change-value";
import {
  formatDateTime,
  formatMarketPrice,
  formatPercent,
} from "@/lib/formatters";
import type { PortfolioHoldingsProps } from "@/types/portfolio";

const HOLDING_QUANTITY_FORMAT_OPTIONS = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
} as const satisfies Intl.NumberFormatOptions;

const FX_RATE_FORMAT_OPTIONS = {
  maximumFractionDigits: 6,
  minimumFractionDigits: 0,
} as const satisfies Intl.NumberFormatOptions;

function buildFxBadgeDetails(
  holding: PortfolioHoldingsProps["holdings"][number],
  locale: PortfolioHoldingsProps["locale"],
  messages: PortfolioHoldingsProps["messages"],
) {
  const source = `${messages.fxBadgeSource}: ${holding.valuationFxSource}`;
  const collectedAt = holding.valuationFxCollectedAt
    ? `${messages.fxBadgeCollectedAt}: ${formatDateTime(
        holding.valuationFxCollectedAt,
        locale,
      )}`
    : null;
  const ariaLabel = [
    `${messages.fxBadge} ${holding.quoteCurrency}→${holding.valuationCurrency}`,
    source,
    collectedAt,
  ]
    .filter((item): item is string => item !== null)
    .join(" · ");

  return {
    ariaLabel,
    collectedAt,
    source,
  };
}

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
            <span role="columnheader">
              {messages.columns.unrealizedProfitLoss}
            </span>
            <span role="columnheader">{messages.columns.returnRate}</span>
          </div>

          {holdings.map((holding) => {
            const fxBadgeDetails = buildFxBadgeDetails(
              holding,
              locale,
              messages,
            );

            return (
              <div
                className="portfolio-holdings-row portfolio-holdings-row-live"
                key={holding.symbol}
                role="row"
              >
              <div className="asset-cell" role="cell">
                <AssetMark color={holding.color} symbol={holding.symbol} />
                <span>
                  <strong>{holding.symbol}</strong>
                  <small>{holding.name}</small>
                  {holding.quoteCurrency ===
                  holding.valuationCurrency ? null : (
                    <span
                      aria-label={fxBadgeDetails.ariaLabel}
                      className="holding-fx-badge"
                      tabIndex={0}
                    >
                      <span className="holding-fx-badge-label">
                        {messages.fxBadge} {holding.quoteCurrency}
                        {"→"}
                        {holding.valuationCurrency} ·{" "}
                        {holding.valuationFxRate.toLocaleString(
                          locale,
                          FX_RATE_FORMAT_OPTIONS,
                        )}
                      </span>
                      <span className="holding-fx-tooltip" role="tooltip">
                        <span>{fxBadgeDetails.source}</span>
                        {fxBadgeDetails.collectedAt ? (
                          <span>{fxBadgeDetails.collectedAt}</span>
                        ) : null}
                      </span>
                    </span>
                  )}
                </span>
              </div>
              <HoldingChangeValue
                className="numeric-cell"
                deltaType="quantity"
                locale={locale}
                role="cell"
                shareUnit={messages.shareUnit}
                value={holding.quantity}
              >
                {holding.quantity.toLocaleString(
                  locale,
                  HOLDING_QUANTITY_FORMAT_OPTIONS,
                )}
                {messages.shareUnit}
              </HoldingChangeValue>
              <HoldingChangeValue
                className="numeric-cell average-price"
                currency={holding.quoteCurrency}
                deltaType="currency"
                locale={locale}
                role="cell"
                value={holding.averagePrice}
              >
                {formatMarketPrice(
                  holding.averagePrice,
                  holding.quoteCurrency,
                  locale,
                )}
              </HoldingChangeValue>
              <HoldingChangeValue
                className="numeric-cell current-price"
                currency={holding.quoteCurrency}
                deltaType="currency"
                locale={locale}
                role="cell"
                value={holding.currentPrice}
              >
                {formatMarketPrice(
                  holding.currentPrice,
                  holding.quoteCurrency,
                  locale,
                )}
              </HoldingChangeValue>
              <HoldingChangeValue
                className="numeric-cell strong-value"
                currency={holding.valuationCurrency}
                deltaType="currency"
                locale={locale}
                role="cell"
                value={holding.marketValue}
              >
                {formatMarketPrice(
                  holding.marketValue,
                  holding.valuationCurrency,
                  locale,
                )}
              </HoldingChangeValue>
              <HoldingChangeValue
                currency={holding.valuationCurrency}
                deltaType="currency"
                locale={locale}
                role="cell"
                value={holding.unrealizedProfitLoss}
              >
                <TrendValue value={holding.unrealizedProfitLoss}>
                  {formatMarketPrice(
                    holding.unrealizedProfitLoss,
                    holding.valuationCurrency,
                    locale,
                  )}
                </TrendValue>
              </HoldingChangeValue>
              <HoldingChangeValue
                deltaType="percent"
                locale={locale}
                role="cell"
                value={holding.returnRate}
              >
                <TrendValue value={holding.returnRate}>
                  {formatPercent(holding.returnRate, locale)}
                </TrendValue>
              </HoldingChangeValue>
              </div>
            );
          })}
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
