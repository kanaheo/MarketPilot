"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { formatMarketPrice, formatPercent } from "@/lib/formatters";
import type { AssetAllocationProps } from "@/types/portfolio";

export function AssetAllocation({
  currency,
  currentCash,
  locale,
  messages,
}: AssetAllocationProps) {
  const allocation = [
    {
      key: "cash" as const,
      value: currentCash,
      color: "#b9d9b0",
    },
  ];

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
                  data={allocation}
                  dataKey="value"
                  innerRadius="62%"
                  isAnimationActive={false}
                  outerRadius="88%"
                  paddingAngle={1}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {allocation.map((item) => (
                    <Cell fill={item.color} key={item.key} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    formatMarketPrice(Number(value), currency, locale)
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="allocation-chart-center">
            <strong>
              {formatMarketPrice(currentCash, currency, locale)}
            </strong>
            <span>{messages.totalValue}</span>
          </div>
        </div>

        <ul className="allocation-list">
          {allocation.map((item) => (
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
                  {formatPercent(currentCash > 0 ? 1 : 0, locale, {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                    signDisplay: "never",
                  })}
                </strong>
                <small>
                  {formatMarketPrice(item.value, currency, locale)}
                </small>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
