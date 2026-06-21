import { AssetAllocation } from "@/components/portfolio/asset-allocation";
import { CashActivity } from "@/components/portfolio/cash-activity";
import { PortfolioHeader } from "@/components/portfolio/portfolio-header";
import { PortfolioHoldings } from "@/components/portfolio/portfolio-holdings";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { PortfolioValueChart } from "@/components/portfolio/portfolio-value-chart";
import { RiskOverview } from "@/components/portfolio/risk-overview";
import { assertLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import type { PortfolioPageProps } from "@/types/portfolio";

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;

  assertLocale(locale);

  const messages = getMessages(locale);

  return (
    <div className="portfolio-page">
      <PortfolioHeader messages={messages.portfolio.header} />
      <PortfolioSummary
        locale={locale}
        messages={messages.portfolio.summary}
      />
      <div className="portfolio-insights-grid">
        <PortfolioValueChart
          locale={locale}
          messages={messages.portfolio.valueChart}
        />
        <AssetAllocation
          locale={locale}
          messages={messages.portfolio.allocation}
        />
      </div>
      <PortfolioHoldings
        locale={locale}
        messages={messages.portfolio.holdings}
      />
      <div className="portfolio-details-grid">
        <CashActivity
          locale={locale}
          messages={messages.portfolio.cashActivity}
        />
        <RiskOverview locale={locale} messages={messages.portfolio.risk} />
      </div>
    </div>
  );
}
