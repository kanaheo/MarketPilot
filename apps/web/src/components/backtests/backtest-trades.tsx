import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import {
  formatMarketPrice,
  formatPercent,
  formatShortDate,
} from "@/lib/formatters";
import type { BacktestResultsProps } from "@/types/backtests";

export function BacktestTrades({
  locale,
  messages,
  result,
}: BacktestResultsProps) {
  return (
    <Panel className="backtest-trades-panel">
      <SectionHeader
        description={messages.trades.description}
        meta={`${result.tradeCount}${messages.trades.countSuffix}`}
        title={messages.trades.title}
      />

      <div
        className="backtest-trades-table"
        role="table"
        aria-label={messages.trades.title}
      >
        <div className="backtest-trade-row header" role="row">
          <span role="columnheader">{messages.trades.columns.date}</span>
          <span role="columnheader">{messages.trades.columns.asset}</span>
          <span role="columnheader">{messages.trades.columns.side}</span>
          <span role="columnheader">{messages.trades.columns.price}</span>
          <span role="columnheader">{messages.trades.columns.quantity}</span>
          <span role="columnheader">{messages.trades.columns.fee}</span>
          <span role="columnheader">{messages.trades.columns.returnRate}</span>
        </div>

        {result.trades.map((trade) => (
          <div className="backtest-trade-row" key={trade.id} role="row">
            <span role="cell">{formatShortDate(trade.date, locale)}</span>
            <strong role="cell">{trade.symbol}</strong>
            <span role="cell">
              <span className={`backtest-trade-side ${trade.side}`}>
                {trade.side === "buy" ? (
                  <ArrowDownRight size={12} aria-hidden="true" />
                ) : (
                  <ArrowUpRight size={12} aria-hidden="true" />
                )}
                {messages.trades.sides[trade.side]}
              </span>
            </span>
            <span className="numeric-cell" role="cell">
              {formatMarketPrice(trade.price, result.currency, locale)}
            </span>
            <span className="numeric-cell" role="cell">
              {trade.quantity}
            </span>
            <span className="numeric-cell" role="cell">
              {formatMarketPrice(trade.fee, result.currency, locale)}
            </span>
            <span
              className={
                trade.returnRate === null
                  ? "neutral"
                  : trade.returnRate >= 0
                    ? "positive"
                    : "negative"
              }
              role="cell"
            >
              {trade.returnRate === null
                ? "—"
                : formatPercent(trade.returnRate, locale)}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
