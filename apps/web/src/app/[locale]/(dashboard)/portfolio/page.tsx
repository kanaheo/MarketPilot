import { WalletCards } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { AssetAllocation } from "@/components/portfolio/asset-allocation";
import { CashActivity } from "@/components/portfolio/cash-activity";
import { PortfolioHeader } from "@/components/portfolio/portfolio-header";
import { PortfolioHoldings } from "@/components/portfolio/portfolio-holdings";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { assertLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import {
  getPortfolioDetail,
  getPortfolios,
} from "@/lib/server/portfolio-api";
import { mapPortfolioPageData } from "@/lib/portfolio/mapper";
import type { PortfolioPageProps } from "@/types/portfolio";

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;

  assertLocale(locale);

  const messages = getMessages(locale);
  const portfolios = await getPortfolios();

  if (portfolios.length === 0) {
    return (
      <div className="portfolio-page">
        <PortfolioHeader messages={messages.portfolio.header} />
        <EmptyState
          description={messages.portfolio.pageState.empty.description}
          icon={WalletCards}
          title={messages.portfolio.pageState.empty.title}
        />
      </div>
    );
  }

  const portfolio = mapPortfolioPageData(
    await getPortfolioDetail(portfolios[0].id),
  );

  return (
    <div className="portfolio-page">
      <PortfolioHeader
        messages={messages.portfolio.header}
        portfolioName={portfolio.name}
      />
      <PortfolioSummary
        currency={portfolio.currency}
        currentCash={portfolio.currentCash}
        locale={locale}
        messages={messages.portfolio.summary}
      />
      <AssetAllocation
        currency={portfolio.currency}
        currentCash={portfolio.currentCash}
        locale={locale}
        messages={messages.portfolio.allocation}
      />
      <PortfolioHoldings
        holdings={[]}
        locale={locale}
        messages={messages.portfolio.holdings}
      />
      <CashActivity
        activities={portfolio.cashActivities}
        locale={locale}
        messages={messages.portfolio.cashActivity}
      />
    </div>
  );
}
