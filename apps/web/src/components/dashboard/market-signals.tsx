import { SearchX, ShieldCheck } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { dashboardData } from "@/data/dashboard";
import { formatPercent } from "@/lib/formatters";
import type { MarketSignalsProps } from "@/types/dashboard";

export function MarketSignals({ locale, messages }: MarketSignalsProps) {
  const hasSignals = dashboardData.signals.length > 0;

  return (
    <Panel className="compact-panel signals-panel">
      <SectionHeader
        actionLabel={messages.viewAll}
        description={messages.description}
        title={messages.title}
      />

      {hasSignals ? (
        <>
          <div className="signal-list">
            {dashboardData.signals.map((signal) => {
              const content = messages.items[signal.key];

              return (
                <article className="signal-item" key={signal.symbol}>
                  <span className="ticker-chip">{signal.symbol}</span>
                  <div className="signal-copy">
                    <div>
                      <strong>{content.title}</strong>
                      <span className={`risk-badge ${signal.risk}`}>
                        {messages.risks[signal.risk]}
                      </span>
                    </div>
                    <p>{content.description}</p>
                  </div>
                  <div className="signal-probability">
                    <span>{messages.probability}</span>
                    <strong>
                      {formatPercent(signal.probability, locale, {
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                        signDisplay: "never",
                      })}
                    </strong>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="risk-disclaimer">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>{messages.disclaimer}</span>
          </p>
        </>
      ) : (
        <EmptyState
          description={messages.empty.description}
          icon={SearchX}
          title={messages.empty.title}
        />
      )}
    </Panel>
  );
}
