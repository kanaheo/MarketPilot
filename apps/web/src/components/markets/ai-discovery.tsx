import { BrainCircuit, ShieldAlert, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { marketAiSignals, marketInstruments } from "@/data/markets";
import type { AiDiscoveryProps } from "@/types/markets";

export function AiDiscovery({ instruments, messages }: AiDiscoveryProps) {
  const visibleSymbols = new Set(
    instruments.map((instrument) => instrument.symbol),
  );
  const signals = marketAiSignals.filter((signal) =>
    visibleSymbols.has(signal.symbol),
  );

  return (
    <Panel className="ai-discovery-panel">
      <div className="ai-discovery-heading">
        <SectionHeader
          description={messages.description}
          icon={Sparkles}
          title={messages.title}
        />
        <span>{messages.updated}</span>
      </div>

      {signals.length > 0 ? (
        <div className="ai-discovery-grid">
          {signals.map((signal) => {
            const instrument = marketInstruments.find(
              (item) => item.symbol === signal.symbol,
            );
            const content = messages.items[signal.key];

            if (!instrument) {
              return null;
            }

            return (
              <article className="ai-discovery-card" key={signal.key}>
                <header>
                  <div>
                    <span className="ai-market-tag">
                      {messages.countries[instrument.country]} ·{" "}
                      {instrument.exchange}
                    </span>
                    <h3>
                      {instrument.symbol}
                      <small>{instrument.name}</small>
                    </h3>
                  </div>
                  <span className={`ai-risk-badge ${signal.risk}`}>
                    {messages.risks[signal.risk]}
                  </span>
                </header>

                <div className="ai-signal-score">
                  <span>{content.signal}</span>
                  <strong>{Math.round(signal.probability * 100)}%</strong>
                </div>

                <div className="ai-signal-reasons">
                  <p>
                    <BrainCircuit size={14} aria-hidden="true" />
                    <span>
                      <strong>{messages.evidence}</strong>
                      {content.evidence}
                    </span>
                  </p>
                  <p>
                    <ShieldAlert size={14} aria-hidden="true" />
                    <span>
                      <strong>{messages.counterRisk}</strong>
                      {content.counterRisk}
                    </span>
                  </p>
                </div>

                <footer>{messages.fixtureLabel}</footer>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          description={messages.empty.description}
          icon={BrainCircuit}
          title={messages.empty.title}
        />
      )}

      <p className="ai-discovery-disclaimer">{messages.disclaimer}</p>
    </Panel>
  );
}
