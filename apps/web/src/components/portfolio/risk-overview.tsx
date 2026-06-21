import { Activity, Crosshair, PieChart } from "lucide-react";

import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { portfolioData } from "@/data/portfolio";
import { formatPercent } from "@/lib/formatters";
import type { RiskOverviewProps } from "@/types/portfolio";

const riskIcons = {
  concentration: Crosshair,
  diversification: PieChart,
  volatility: Activity,
} as const;

export function RiskOverview({ locale, messages }: RiskOverviewProps) {
  return (
    <Panel className="portfolio-detail-panel risk-overview-panel">
      <SectionHeader description={messages.description} title={messages.title} />

      <div className="risk-overview-list">
        {portfolioData.risk.map((risk) => {
          const Icon = riskIcons[risk.key];
          const content = messages.items[risk.key];
          const displayValue =
            risk.key === "volatility"
              ? formatPercent(risk.score, locale, { signDisplay: "never" })
              : messages.status[risk.status];

          return (
            <article className="risk-overview-item" key={risk.key}>
              <span className="risk-overview-icon">
                <Icon size={18} aria-hidden="true" />
              </span>
              <div className="risk-overview-copy">
                <strong>{content.title}</strong>
                <span>{content.description}</span>
              </div>
              <div className="risk-overview-score">
                <div
                  aria-label={content.title}
                  aria-valuemax={100}
                  aria-valuemin={0}
                  aria-valuenow={Math.round(risk.score * 100)}
                  className="risk-progress"
                  role="progressbar"
                >
                  <span style={{ width: `${risk.score * 100}%` }} />
                </div>
                <strong>{displayValue}</strong>
              </div>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}
