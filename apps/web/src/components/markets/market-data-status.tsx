import { Activity, CheckCircle2, Clock3, Database, XCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Panel } from "@/components/common/panel";
import { formatDateTime } from "@/lib/formatters";
import type { MarketDataStatusProps } from "@/types/markets";

export function MarketDataStatus({
  freshness,
  locale,
  messages,
  schedulerStatus,
}: MarketDataStatusProps) {
  const latestRun = schedulerStatus?.latest_run ?? null;
  const freshCount = freshness.filter((item) => item.is_fresh).length;
  const staleCount = freshness.filter(
    (item) => item.has_snapshot && !item.is_fresh,
  ).length;
  const missingCount = freshness.filter((item) => !item.has_snapshot).length;
  const latestCollectedAt = findLatestCollectedAt(freshness);
  const health = resolveHealth({
    failedCount: schedulerStatus?.failed_count ?? 0,
    freshCount,
    missingCount,
    staleCount,
    totalCount: freshness.length,
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

function resolveHealth({
  failedCount,
  freshCount,
  missingCount,
  staleCount,
  totalCount,
}: Readonly<{
  failedCount: number;
  freshCount: number;
  missingCount: number;
  staleCount: number;
  totalCount: number;
}>): "healthy" | "warning" | "critical" {
  if (failedCount > 0 || missingCount > 0) {
    return "critical";
  }

  if (totalCount === 0 || staleCount > 0 || freshCount < totalCount) {
    return "warning";
  }

  return "healthy";
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
