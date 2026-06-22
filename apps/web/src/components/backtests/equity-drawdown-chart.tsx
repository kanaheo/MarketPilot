"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import {
  formatMarketPrice,
  formatPercent,
  formatShortDate,
} from "@/lib/formatters";
import type { BacktestResultsProps } from "@/types/backtests";

export function EquityDrawdownChart({
  locale,
  messages,
  result,
}: BacktestResultsProps) {
  return (
    <Panel className="backtest-equity-panel">
      <SectionHeader
        description={messages.chart.description}
        meta={messages.chart.fixture}
        title={messages.chart.title}
      />
      <div className="backtest-equity-chart" aria-label={messages.chart.title}>
        <ResponsiveContainer
          height="100%"
          initialDimension={{ height: 280, width: 820 }}
          minWidth={0}
          width="100%"
        >
          <ComposedChart
            data={result.chart}
            margin={{ bottom: 0, left: 0, right: 8, top: 18 }}
          >
            <defs>
              <linearGradient id="backtestEquityFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#16796f" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#16796f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#e8ecea"
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="date"
              fontSize={9}
              tick={{ fill: "#7b8580" }}
              tickFormatter={(value) => formatShortDate(String(value), locale)}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              fontSize={9}
              tick={{ fill: "#7b8580" }}
              tickFormatter={(value) =>
                formatMarketPrice(Number(value), result.currency, locale)
              }
              tickLine={false}
              width={74}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #dfe4e1",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(22, 32, 28, 0.08)",
                fontSize: 11,
              }}
              formatter={(value, name) => [
                formatMarketPrice(Number(value), result.currency, locale),
                name === "portfolio"
                  ? messages.chart.portfolio
                  : messages.chart.benchmark,
              ]}
              labelFormatter={(value) => formatShortDate(String(value), locale)}
            />
            <Area
              dataKey="portfolio"
              fill="url(#backtestEquityFill)"
              isAnimationActive={false}
              stroke="#16796f"
              strokeWidth={2.5}
              type="monotone"
            />
            <Line
              dataKey="benchmark"
              dot={false}
              isAnimationActive={false}
              stroke="#929c97"
              strokeDasharray="5 5"
              strokeWidth={1.8}
              type="monotone"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="backtest-chart-legend">
        <span className="portfolio">{messages.chart.portfolio}</span>
        <span className="benchmark">{messages.chart.benchmark}</span>
      </div>

      <div className="backtest-drawdown-heading">
        <strong>{messages.chart.drawdown}</strong>
        <span>{formatPercent(result.maxDrawdown, locale)}</span>
      </div>
      <div
        className="backtest-drawdown-chart"
        aria-label={messages.chart.drawdown}
      >
        <ResponsiveContainer
          height="100%"
          initialDimension={{ height: 110, width: 820 }}
          minWidth={0}
          width="100%"
        >
          <ComposedChart
            data={result.chart}
            margin={{ bottom: 0, left: 0, right: 8, top: 8 }}
          >
            <CartesianGrid
              stroke="#f0e5e5"
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis dataKey="date" hide />
            <YAxis
              axisLine={false}
              domain={["dataMin", 0]}
              fontSize={8}
              tick={{ fill: "#9a7779" }}
              tickFormatter={(value) =>
                formatPercent(Number(value), locale, {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })
              }
              tickLine={false}
              width={52}
            />
            <Tooltip
              formatter={(value) => [
                formatPercent(Number(value), locale),
                messages.chart.drawdown,
              ]}
              labelFormatter={(value) => formatShortDate(String(value), locale)}
            />
            <Area
              dataKey="drawdown"
              fill="#f7dfe0"
              isAnimationActive={false}
              stroke="#d84950"
              strokeWidth={1.6}
              type="monotone"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
