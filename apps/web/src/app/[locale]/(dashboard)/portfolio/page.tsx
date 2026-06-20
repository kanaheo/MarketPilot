import { PortfolioHeader } from "@/components/portfolio/portfolio-header";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
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
    </div>
  );
}
