import Link from "next/link";
import { CheckCircle2, PlusCircle } from "lucide-react";

import { formatMarketPrice } from "@/lib/formatters";
import type { PortfolioSelectorProps } from "@/types/portfolio";

export function PortfolioSelector({
  locale,
  messages,
  portfolios,
  selectedPortfolioId,
}: PortfolioSelectorProps) {
  return (
    <section className="portfolio-switcher" aria-label={messages.label}>
      <div className="portfolio-switcher-header">
        <div>
          <span>{messages.label}</span>
          <strong>{portfolios.length}</strong>
        </div>
        <a href="#new-portfolio">
          <PlusCircle size={15} strokeWidth={2} />
          {messages.createAnother}
        </a>
      </div>
      <div className="portfolio-switcher-list">
        {portfolios.map((portfolio) => {
          const isSelected = portfolio.id === selectedPortfolioId;

          return (
            <Link
              aria-current={isSelected ? "page" : undefined}
              className={isSelected ? "active" : undefined}
              href={`/${locale}/portfolio?portfolioId=${portfolio.id}`}
              key={portfolio.id}
            >
              <div className="portfolio-switcher-card-title">
                <strong>{portfolio.name}</strong>
                {isSelected ? (
                  <span aria-hidden="true">
                    <CheckCircle2 size={15} strokeWidth={2.2} />
                  </span>
                ) : null}
              </div>
              <dl>
                <div>
                  <dt>{messages.currentCash}</dt>
                  <dd>
                    {formatMarketPrice(
                      portfolio.currentCash,
                      portfolio.currency,
                      locale,
                    )}
                  </dd>
                </div>
              </dl>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
