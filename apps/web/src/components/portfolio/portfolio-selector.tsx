import Link from "next/link";

import { formatMarketPrice } from "@/lib/formatters";
import type { PortfolioSelectorProps } from "@/types/portfolio";

export function PortfolioSelector({
  locale,
  messages,
  portfolios,
  selectedPortfolioId,
}: PortfolioSelectorProps) {
  if (portfolios.length <= 1) {
    return null;
  }

  return (
    <section className="portfolio-selector" aria-label={messages.label}>
      <div className="portfolio-selector-list">
        {portfolios.map((portfolio) => {
          const isSelected = portfolio.id === selectedPortfolioId;

          return (
            <Link
              aria-current={isSelected ? "page" : undefined}
              className={isSelected ? "active" : undefined}
              href={`/${locale}/portfolio?portfolioId=${portfolio.id}`}
              key={portfolio.id}
            >
              <strong>{portfolio.name}</strong>
              <span>
                {messages.currentCash}{" "}
                {formatMarketPrice(
                  portfolio.currentCash,
                  portfolio.currency,
                  locale,
                )}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
