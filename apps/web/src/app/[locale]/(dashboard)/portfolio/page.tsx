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
import type { PortfolioCashActivity } from "@/types/portfolio";
import type { PortfolioPageProps } from "@/types/portfolio";

function createCashActivities(
  currentCash: number,
  transactions: Awaited<
    ReturnType<typeof getPortfolioDetail>
  >["recent_cash_transactions"],
): readonly PortfolioCashActivity[] {
  let balance = currentCash;

  return transactions.map((transaction) => {
    const amount = Number(transaction.amount);
    const activity = {
      id: transaction.id,
      type: transaction.transaction_type,
      occurredAt: transaction.occurred_at,
      amount,
      balance,
      currency: transaction.currency,
      note: transaction.note,
    };

    balance +=
      transaction.transaction_type === "WITHDRAWAL" ||
      transaction.transaction_type === "FEE"
        ? amount
        : -amount;

    return activity;
  });
}

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

  const detail = await getPortfolioDetail(portfolios[0].id);
  const currentCash = Number(detail.current_cash);
  const cashActivities = createCashActivities(
    currentCash,
    detail.recent_cash_transactions,
  );

  return (
    <div className="portfolio-page">
      <PortfolioHeader
        messages={messages.portfolio.header}
        portfolioName={detail.name}
      />
      <PortfolioSummary
        currency={detail.base_currency}
        currentCash={currentCash}
        locale={locale}
        messages={messages.portfolio.summary}
      />
      <AssetAllocation
        currency={detail.base_currency}
        currentCash={currentCash}
        locale={locale}
        messages={messages.portfolio.allocation}
      />
      <PortfolioHoldings
        holdings={[]}
        locale={locale}
        messages={messages.portfolio.holdings}
      />
      <CashActivity
        activities={cashActivities}
        locale={locale}
        messages={messages.portfolio.cashActivity}
      />
    </div>
  );
}
