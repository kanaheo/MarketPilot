"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { portfolioData } from "@/data/portfolio";
import { formatDollar, formatPercent } from "@/lib/formatters";
import type { AssetAllocationProps } from "@/types/portfolio";

export function AssetAllocation({
  locale,
  messages,
}: AssetAllocationProps) {
  const totalValue = portfolioData.summary.totalValue.value;

  return (
    <Panel className="asset-allocation-panel">
      <SectionHeader title={messages.title} />

      <div className="asset-allocation-content">
        <div className="allocation-chart-wrap">
          <div className="allocation-chart" aria-label={messages.chartLabel}>
            <ResponsiveContainer
              height="100%"
              initialDimension={{ height: 248, width: 248 }}
              minWidth={0}
              width="100%"
            >
              <PieChart>
                <Pie
                  data={portfolioData.allocation}
                  dataKey="value"
                  innerRadius="62%"
                  isAnimationActive={false}
                  outerRadius="88%"
                  paddingAngle={1}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {portfolioData.allocation.map((item) => (
                    <Cell fill={item.color} key={item.key} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatDollar(Number(value), locale)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="allocation-chart-center">
            <strong>{formatDollar(totalValue, locale)}</strong>
            <span>{messages.totalValue}</span>
          </div>
        </div>

        <ul className="allocation-list">
          {portfolioData.allocation.map((item) => (
            <li key={item.key}>
              <span
                className="allocation-color"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="allocation-name">
                {messages.items[item.key]}
              </span>
              <span className="allocation-values">
                <strong>
                  {formatPercent(item.value / totalValue, locale, {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                    signDisplay: "never",
                  })}
                </strong>
                <small>{formatDollar(item.value, locale)}</small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
