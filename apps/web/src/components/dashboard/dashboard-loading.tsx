"use client";

import { useParams } from "next/navigation";

import { LoadingSkeleton } from "@/components/common/loading-skeleton";
import { getMessages } from "@/i18n/messages";
import type { Locale } from "@/types/i18n";

function resolveLocale(value: string | string[] | undefined): Locale {
  const locale = Array.isArray(value) ? value[0] : value;

  return locale === "en" || locale === "ja" ? locale : "ko";
}

export function DashboardLoading() {
  const params = useParams<{ locale?: string | string[] }>();
  const locale = resolveLocale(params.locale);
  const messages = getMessages(locale);

  return (
    <div
      className="dashboard-page dashboard-loading"
      aria-busy="true"
      aria-label={messages.feedback.loading}
    >
      <div className="dashboard-loading-header">
        <div>
          <LoadingSkeleton height={31} width={280} />
          <LoadingSkeleton height={18} width={390} />
        </div>
        <div className="dashboard-loading-actions">
          <LoadingSkeleton height={42} width={105} />
          <LoadingSkeleton height={42} width={130} />
        </div>
      </div>

      <div className="dashboard-summary-grid">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="summary-card loading-card" key={index}>
            <LoadingSkeleton height={15} width="48%" />
            <LoadingSkeleton height={27} width="72%" />
            <LoadingSkeleton height={13} width="88%" />
          </div>
        ))}
      </div>

      <div className="dashboard-primary-grid">
        <div className="panel loading-panel large">
          <LoadingSkeleton height={20} width="32%" />
          <LoadingSkeleton height={14} width="45%" />
          <LoadingSkeleton className="chart" height={230} />
        </div>
        <div className="panel loading-panel">
          <LoadingSkeleton height={20} width="38%" />
          {Array.from({ length: 5 }, (_, index) => (
            <LoadingSkeleton height={42} key={index} />
          ))}
        </div>
      </div>

      <div className="dashboard-secondary-grid">
        {Array.from({ length: 3 }, (_, panelIndex) => (
          <div className="panel loading-panel compact" key={panelIndex}>
            <LoadingSkeleton height={20} width="42%" />
            <LoadingSkeleton height={13} width="58%" />
            {Array.from({ length: 3 }, (_, rowIndex) => (
              <LoadingSkeleton height={44} key={rowIndex} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
