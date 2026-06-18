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
import { dashboardData } from "@/data/dashboard";
import { formatPercent } from "@/lib/formatters";
import type { PerformanceChartProps } from "@/types/dashboard";

export function PerformanceChart({
  locale,
  messages,
}: PerformanceChartProps) {
  return (
    <Panel className="performance-panel">
      <div className="performance-heading-row">
        <SectionHeader
          description={messages.description}
          title={messages.title}
        />
        <div className="period-tabs" aria-label={messages.periodLabel}>
          {messages.periods.map((period) => (
            <button
              className={period.active ? "active" : ""}
              key={period.label}
              type="button"
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="performance-stats">
        <strong>{formatPercent(0.0873, locale)}</strong>
        <span>
          {messages.benchmark} {formatPercent(0.041, locale)}
        </span>
      </div>

      <div className="performance-chart" aria-label={messages.chartLabel}>
        <ResponsiveContainer
          height="100%"
          initialDimension={{ height: 235, width: 720 }}
          minWidth={0}
          width="100%"
        >
          <ComposedChart
            data={dashboardData.performance}
            margin={{ bottom: 0, left: -20, right: 8, top: 8 }}
          >
            <defs>
              <linearGradient id="portfolioFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#16796f" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#16796f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e8ecea" strokeDasharray="4 4" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              fontSize={11}
              tick={{ fill: "#7b8580" }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              domain={[98, 110]}
              fontSize={11}
              tick={{ fill: "#7b8580" }}
              tickFormatter={(value) => `${value}%`}
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
                `${Number(value).toFixed(2)}%`,
                name === "portfolio"
                  ? messages.portfolio
                  : messages.benchmark,
              ]}
            />
            <Area
              dataKey="portfolio"
              fill="url(#portfolioFill)"
              isAnimationActive={false}
              stroke="#16796f"
              strokeWidth={2.5}
              type="monotone"
            />
            <Line
              dataKey="benchmark"
              dot={false}
              isAnimationActive={false}
              stroke="#8d9792"
              strokeDasharray="5 5"
              strokeWidth={1.8}
              type="monotone"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-legend">
        <span className="portfolio">{messages.portfolio}</span>
        <span className="benchmark">{messages.benchmark}</span>
      </div>
    </Panel>
  );
}
