import { Activity, BarChart3, BrainCircuit, RadioTower } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Panel } from "@/components/common/panel";
import { SectionHeader } from "@/components/common/section-header";
import { formatCompactNumber, formatPercent } from "@/lib/formatters";
import type {
  MarketInstrument,
  MarketPulseProps,
} from "@/types/markets";

const countries = ["us", "kr", "jp"] as const;

export function MarketPulse({
  instruments,
  locale,
  messages,
}: MarketPulseProps) {
  if (instruments.length === 0) {
    return (
      <Panel className="market-pulse-panel">
        <SectionHeader
          description={messages.description}
          icon={Activity}
          title={messages.title}
        />
        <EmptyState
          description={messages.empty.description}
          icon={RadioTower}
          title={messages.empty.title}
        />
      </Panel>
    );
  }

  const breadth = countries
    .map((country) => {
      const countryInstruments = instruments.filter(
        (instrument) => instrument.country === country,
      );
      const advancing = countryInstruments.filter(
        (instrument) => instrument.changeRate > 0,
      ).length;

      return {
        country,
        count: countryInstruments.length,
        ratio:
          countryInstruments.length === 0
            ? 0
            : advancing / countryInstruments.length,
      };
    })
    .filter((item) => item.count > 0);

  const sectorPerformance = new Map<
    MarketInstrument["sector"],
    { total: number; count: number }
  >();

  instruments.forEach((instrument) => {
    const current = sectorPerformance.get(instrument.sector) ?? {
      total: 0,
      count: 0,
    };

    sectorPerformance.set(instrument.sector, {
      total: current.total + instrument.changeRate,
      count: current.count + 1,
    });
  });

  const strongestSector = [...sectorPerformance.entries()]
    .map(([sector, value]) => ({
      sector,
      average: value.total / value.count,
    }))
    .sort((left, right) => right.average - left.average)[0];

  const unusualVolume = [...instruments]
    .filter((instrument) => instrument.volumeBand === "high")
    .sort((left, right) => right.volume - left.volume)[0];

  const averageChange =
    instruments.reduce(
      (total, instrument) => total + instrument.changeRate,
      0,
    ) / instruments.length;
  const summaryTone =
    averageChange > 0.005
      ? "positive"
      : averageChange < -0.005
        ? "negative"
        : "mixed";

  return (
    <Panel className="market-pulse-panel">
      <SectionHeader
        description={messages.description}
        icon={Activity}
        title={messages.title}
      />

      <section className="market-pulse-section">
        <h3>{messages.breadthTitle}</h3>
        <div className="market-breadth-list">
          {breadth.map((item) => (
            <div className="market-breadth-item" key={item.country}>
              <div>
                <strong>{messages.countries[item.country]}</strong>
                <span>
                  {formatPercent(item.ratio, locale, {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                    signDisplay: "never",
                  })}{" "}
                  {messages.advancing}
                </span>
              </div>
              <div
                aria-label={`${messages.countries[item.country]} ${messages.advancing}`}
                aria-valuemax={100}
                aria-valuemin={0}
                aria-valuenow={Math.round(item.ratio * 100)}
                className="market-breadth-progress"
                role="progressbar"
              >
                <span style={{ width: `${item.ratio * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="market-pulse-highlights">
        <article>
          <span className="market-pulse-icon">
            <BarChart3 size={16} aria-hidden="true" />
          </span>
          <div>
            <small>{messages.strongestSector}</small>
            <strong>{messages.sectors[strongestSector.sector]}</strong>
            <span>
              {formatPercent(strongestSector.average, locale)}{" "}
              {messages.averageChange}
            </span>
          </div>
        </article>

        <article>
          <span className="market-pulse-icon warning">
            <RadioTower size={16} aria-hidden="true" />
          </span>
          <div>
            <small>{messages.unusualVolume}</small>
            {unusualVolume ? (
              <>
                <strong>{unusualVolume.symbol}</strong>
                <span>
                  {formatCompactNumber(unusualVolume.volume, locale)}{" "}
                  {messages.shares}
                </span>
              </>
            ) : (
              <strong>{messages.noUnusualVolume}</strong>
            )}
          </div>
        </article>
      </div>

      <section className="market-ai-summary">
        <header>
          <span>
            <BrainCircuit size={16} aria-hidden="true" />
          </span>
          <div>
            <h3>{messages.summaryTitle}</h3>
            <small>{messages.updated}</small>
          </div>
        </header>
        <p>{messages.summaries[summaryTone]}</p>
        <dl>
          <div>
            <dt>{messages.evidenceLabel}</dt>
            <dd>{messages.evidence}</dd>
          </div>
          <div>
            <dt>{messages.riskLabel}</dt>
            <dd>{messages.risk}</dd>
          </div>
        </dl>
        <footer>{messages.source}</footer>
      </section>
    </Panel>
  );
}
