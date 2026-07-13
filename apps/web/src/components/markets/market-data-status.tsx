import { Activity, CheckCircle2, Clock3, Database, XCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Panel } from "@/components/common/panel";
import { formatDateTime, formatMarketPrice } from "@/lib/formatters";
import type { MarketDataStatusProps } from "@/types/markets";

export function MarketDataStatus({
  availability,
  freshness,
  locale,
  messages,
  schedulerStatus,
}: MarketDataStatusProps) {
  const unavailableSources = getUnavailableSources(availability, messages);
  const latestRun = schedulerStatus?.latest_run ?? null;
  const freshCount = freshness.filter((item) => item.is_fresh).length;
  const staleCount = freshness.filter(
    (item) => item.has_snapshot && !item.is_fresh,
  ).length;
  const missingCount = freshness.filter((item) => !item.has_snapshot).length;
  const latestCollectedAt = findLatestCollectedAt(freshness);
  const prioritizedFreshness = prioritizeFreshness(freshness).slice(0, 6);
  const health = resolveHealth({
    failedCount: schedulerStatus?.failed_count ?? 0,
    freshCount,
    missingCount,
    staleCount,
    totalCount: freshness.length,
    unavailableCount: unavailableSources.length,
  });

  return (
    <Panel className="market-data-status-panel">
      <header className="market-data-status-heading">
        <div>
          <span className="market-data-status-eyebrow">{messages.eyebrow}</span>
          <h2>{messages.title}</h2>
          <p>{messages.description}</p>
        </div>
        <span className={`market-data-health ${health}`}>
          {health === "healthy" ? (
            <CheckCircle2 size={16} aria-hidden="true" />
          ) : health === "warning" ? (
            <Clock3 size={16} aria-hidden="true" />
          ) : (
            <XCircle size={16} aria-hidden="true" />
          )}
          {messages.health[health]}
        </span>
      </header>

      {unavailableSources.length > 0 ? (
        <div className="market-data-alert" role="status">
          <XCircle size={16} aria-hidden="true" />
          <span>
            {messages.availability.warningPrefix}{" "}
            <strong>{unavailableSources.join(", ")}</strong>
          </span>
        </div>
      ) : null}

      <div className="market-data-status-grid">
        <StatusMetric
          icon={<Database size={17} aria-hidden="true" />}
          label={messages.metrics.tracked}
          value={String(freshness.length)}
        />
        <StatusMetric
          icon={<CheckCircle2 size={17} aria-hidden="true" />}
          label={messages.metrics.fresh}
          value={String(freshCount)}
        />
        <StatusMetric
          icon={<Clock3 size={17} aria-hidden="true" />}
          label={messages.metrics.stale}
          value={String(staleCount + missingCount)}
        />
        <StatusMetric
          icon={<Activity size={17} aria-hidden="true" />}
          label={messages.metrics.lastCollected}
          value={
            latestCollectedAt === null
              ? messages.emptyValue
              : formatDateTime(latestCollectedAt, locale)
          }
        />
      </div>

      <div className="market-data-scheduler-strip">
        <div>
          <span>{messages.scheduler.title}</span>
          <strong>
            {latestRun === null
              ? messages.scheduler.noRuns
              : messages.scheduler.statuses[latestRun.status]}
          </strong>
        </div>
        <dl>
          <div>
            <dt>{messages.scheduler.recentRuns}</dt>
            <dd>{schedulerStatus?.recent_run_count ?? 0}</dd>
          </div>
          <div>
            <dt>{messages.scheduler.running}</dt>
            <dd>{schedulerStatus?.running_count ?? 0}</dd>
          </div>
          <div>
            <dt>{messages.scheduler.failed}</dt>
            <dd>{schedulerStatus?.failed_count ?? 0}</dd>
          </div>
          <div>
            <dt>{messages.scheduler.nextInterval}</dt>
            <dd>
              {latestRun === null
                ? messages.emptyValue
                : formatSeconds(latestRun.next_interval_seconds, messages)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="market-data-details-grid">
        <section className="market-data-freshness-list">
          <header>
            <h3>{messages.freshness.title}</h3>
            <span>{messages.freshness.limitLabel}</span>
          </header>
          {prioritizedFreshness.length === 0 ? (
            <p className="market-data-empty">{messages.freshness.empty}</p>
          ) : (
            <div
              className="market-data-freshness-table"
              role="table"
              aria-label={messages.freshness.title}
            >
              <div className="market-data-freshness-row header" role="row">
                <span role="columnheader">{messages.freshness.columns.symbol}</span>
                <span role="columnheader">{messages.freshness.columns.status}</span>
                <span role="columnheader">{messages.freshness.columns.price}</span>
                <span role="columnheader">{messages.freshness.columns.age}</span>
                <span role="columnheader">{messages.freshness.columns.source}</span>
              </div>
              {prioritizedFreshness.map((item) => {
                const status = resolveFreshnessStatus(item);

                return (
                  <div
                    className="market-data-freshness-row"
                    key={item.symbol}
                    role="row"
                  >
                    <strong role="cell">{item.symbol}</strong>
                    <span className={`market-data-status-chip ${status}`} role="cell">
                      {messages.freshness.statuses[status]}
                    </span>
                    <span role="cell">
                      {item.current_price === null || item.currency === null
                        ? messages.emptyValue
                        : formatMarketPrice(
                            Number(item.current_price),
                            item.currency,
                            locale,
                          )}
                    </span>
                    <span role="cell">
                      {item.age_seconds === null
                        ? messages.emptyValue
                        : formatAge(item.age_seconds, messages)}
                    </span>
                    <span role="cell">{item.source ?? messages.emptyValue}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="market-data-latest-run">
          <header>
            <h3>{messages.latestRun.title}</h3>
            <span>
              {latestRun?.completed_at === null
                ? messages.emptyValue
                : latestRun?.completed_at === undefined
                  ? messages.emptyValue
                  : formatDateTime(latestRun.completed_at, locale)}
            </span>
          </header>
          <dl>
            <div>
              <dt>{messages.latestRun.requested}</dt>
              <dd>{latestRun?.requested_count ?? 0}</dd>
            </div>
            <div>
              <dt>{messages.latestRun.stored}</dt>
              <dd>{latestRun?.stored_count ?? 0}</dd>
            </div>
            <div>
              <dt>{messages.latestRun.freshSkipped}</dt>
              <dd>{latestRun?.fresh_skipped_count ?? 0}</dd>
            </div>
            <div>
              <dt>{messages.latestRun.skipped}</dt>
              <dd>{latestRun?.skipped_count ?? 0}</dd>
            </div>
          </dl>
          {latestRun?.error_message ? (
            <p className="market-data-run-error">{latestRun.error_message}</p>
          ) : null}
        </section>
      </div>
    </Panel>
  );
}

function StatusMetric({
  icon,
  label,
  value,
}: Readonly<{
  icon: ReactNode;
  label: string;
  value: string;
}>) {
  return (
    <article className="market-data-status-metric">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function findLatestCollectedAt(
  freshness: MarketDataStatusProps["freshness"],
): string | null {
  const timestamps = freshness
    .map((item) => item.collected_at)
    .filter((value): value is string => value !== null)
    .map((value) => Date.parse(value))
    .filter((value) => Number.isFinite(value));

  if (timestamps.length === 0) {
    return null;
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

function prioritizeFreshness(freshness: MarketDataStatusProps["freshness"]) {
  return [...freshness].sort((left, right) => {
    const leftRank = getFreshnessRank(left);
    const rightRank = getFreshnessRank(right);

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return left.symbol.localeCompare(right.symbol);
  });
}

function getFreshnessRank(
  item: MarketDataStatusProps["freshness"][number],
): number {
  if (!item.has_snapshot) {
    return 0;
  }

  return item.is_fresh ? 2 : 1;
}

function resolveFreshnessStatus(
  item: MarketDataStatusProps["freshness"][number],
): "fresh" | "stale" | "missing" {
  if (!item.has_snapshot) {
    return "missing";
  }

  return item.is_fresh ? "fresh" : "stale";
}

function resolveHealth({
  failedCount,
  freshCount,
  missingCount,
  staleCount,
  totalCount,
  unavailableCount,
}: Readonly<{
  failedCount: number;
  freshCount: number;
  missingCount: number;
  staleCount: number;
  totalCount: number;
  unavailableCount: number;
}>): "healthy" | "warning" | "critical" {
  if (failedCount > 0 || missingCount > 0 || unavailableCount > 0) {
    return "critical";
  }

  if (totalCount === 0 || staleCount > 0 || freshCount < totalCount) {
    return "warning";
  }

  return "healthy";
}

function getUnavailableSources(
  availability: MarketDataStatusProps["availability"],
  messages: MarketDataStatusProps["messages"],
): string[] {
  const sources: string[] = [];

  if (!availability.quotes) {
    sources.push(messages.availability.sources.quotes);
  }

  if (!availability.freshness) {
    sources.push(messages.availability.sources.freshness);
  }

  if (!availability.scheduler) {
    sources.push(messages.availability.sources.scheduler);
  }

  return sources;
}

function formatSeconds(
  seconds: number,
  messages: MarketDataStatusProps["messages"],
) {
  if (seconds < 60) {
    return `${seconds}${messages.time.seconds}`;
  }

  return `${Math.round(seconds / 60)}${messages.time.minutes}`;
}

function formatAge(seconds: number, messages: MarketDataStatusProps["messages"]) {
  if (seconds < 60) {
    return `${seconds}${messages.time.seconds}`;
  }

  if (seconds < 3600) {
    return `${Math.round(seconds / 60)}${messages.time.minutes}`;
  }

  return `${Math.round(seconds / 3600)}${messages.time.hours}`;
}
