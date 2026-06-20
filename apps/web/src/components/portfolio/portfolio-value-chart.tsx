"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Panel } from "@/components/common/panel";
import { PeriodTabs } from "@/components/common/period-tabs";
import { SectionHeader } from "@/components/common/section-header";
import { portfolioData } from "@/data/portfolio";
import { formatCompactDollar, formatDollar } from "@/lib/formatters";
import type { PortfolioValueChartProps } from "@/types/portfolio";

export function PortfolioValueChart({
  locale,
  messages,
}: PortfolioValueChartProps) {
  return (
    <Panel className="portfolio-value-panel">
      <div className="portfolio-panel-heading">
        <SectionHeader title={messages.title} />
        <PeriodTabs
          ariaLabel={messages.periodLabel}
          periods={messages.periods}
        />
      </div>

      <div className="portfolio-value-chart" aria-label={messages.chartLabel}>
        <ResponsiveContainer
          height="100%"
          initialDimension={{ height: 242, width: 720 }}
          minWidth={0}
          width="100%"
        >
          <LineChart
            data={portfolioData.valueHistory}
            margin={{ bottom: 2, left: -12, right: 8, top: 12 }}
          >
            <CartesianGrid
              stroke="#e8ecea"
              strokeDasharray="4 4"
              vertical={false}
            />
            <XAxis
              axisLine={false}
              dataKey="date"
              fontSize={11}
              tick={{ fill: "#7b8580" }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={[100_000, 140_000]}
              fontSize={11}
              tick={{ fill: "#7b8580" }}
              tickFormatter={(value) =>
                formatCompactDollar(Number(value), locale)
              }
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #dfe4e1",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(22, 32, 28, 0.08)",
                fontSize: 12,
              }}
              formatter={(value, name) => [
                formatDollar(Number(value), locale),
                name === "portfolio"
                  ? messages.portfolio
                  : messages.benchmark,
              ]}
            />
            <Line
              dataKey="portfolio"
              dot={false}
              isAnimationActive={false}
              stroke="#11675f"
              strokeWidth={2.5}
              type="monotone"
            />
            <Line
              dataKey="benchmark"
              dot={false}
              isAnimationActive={false}
              stroke="#98a19d"
              strokeDasharray="5 5"
              strokeWidth={1.8}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="portfolio-chart-legend">
        <span className="portfolio">
          {messages.portfolio}{" "}
          <strong>{formatDollar(124_580.4, locale)}</strong>
        </span>
        <span className="benchmark">
          {messages.benchmark}{" "}
          <strong>{formatDollar(116_100, locale)}</strong>
        </span>
      </div>
    </Panel>
  );
}
