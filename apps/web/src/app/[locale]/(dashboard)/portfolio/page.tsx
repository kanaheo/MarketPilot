import { WalletCards } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { AssetAllocation } from "@/components/portfolio/asset-allocation";
import { CashActivity } from "@/components/portfolio/cash-activity";
import { CashTransactionForm } from "@/components/portfolio/cash-transaction-form";
import { OrderForm } from "@/components/portfolio/order-form";
import { PortfolioCreateForm } from "@/components/portfolio/portfolio-create-form";
import { PortfolioHeader } from "@/components/portfolio/portfolio-header";
import { PortfolioHoldings } from "@/components/portfolio/portfolio-holdings";
import { PortfolioOrders } from "@/components/portfolio/portfolio-orders";
import { PortfolioSelector } from "@/components/portfolio/portfolio-selector";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { assertLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import {
  mapPortfolioOrders,
  mapPortfolioPageData,
} from "@/lib/portfolio/mapper";
import {
  getOrders,
  getPortfolioDetail,
  getPortfolios,
} from "@/lib/server/portfolio-api";
import type { PortfolioPageProps } from "@/types/portfolio";

export default async function PortfolioPage({
  params,
  searchParams,
}: PortfolioPageProps) {
  const { locale } = await params;
  const { portfolioId } = await searchParams;

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
        <PortfolioCreateForm
          locale={locale}
          messages={messages.portfolio.createForm}
        />
      </div>
    );
  }

  const selectedPortfolio =
    portfolios.find((portfolioItem) => portfolioItem.id === portfolioId) ??
    portfolios[0];
  const portfolio = mapPortfolioPageData(
    await getPortfolioDetail(selectedPortfolio.id),
  );
  const orders = mapPortfolioOrders(await getOrders(selectedPortfolio.id));
  const selectorItems = portfolios.map((portfolioItem) => ({
    currentCash: Number(portfolioItem.current_cash),
    currency: portfolioItem.base_currency,
    id: portfolioItem.id,
    name: portfolioItem.name,
  }));

  return (
    <div className="portfolio-page">
      <PortfolioHeader
        messages={messages.portfolio.header}
        portfolioName={portfolio.name}
      />
      <PortfolioSelector
        locale={locale}
        messages={messages.portfolio.selector}
        portfolios={selectorItems}
        selectedPortfolioId={selectedPortfolio.id}
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
      <div className="portfolio-details-grid">
        <OrderForm
          locale={locale}
          messages={messages.portfolio.orderForm}
          portfolioId={selectedPortfolio.id}
        />
        <PortfolioOrders
          locale={locale}
          messages={messages.portfolio.orders}
          orders={orders}
        />
      </div>
      <div className="portfolio-details-grid">
        <CashActivity
          activities={portfolio.cashActivities}
          locale={locale}
          messages={messages.portfolio.cashActivity}
        />
        <CashTransactionForm
          locale={locale}
          messages={messages.portfolio.cashTransactionForm}
          portfolioId={selectedPortfolio.id}
        />
      </div>
    </div>
  );
}
