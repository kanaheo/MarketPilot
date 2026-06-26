import type { PortfolioHeaderProps } from "@/types/portfolio";

export function PortfolioHeader({
  messages,
  portfolioName,
}: PortfolioHeaderProps) {
  return (
    <header className="portfolio-header">
      <h1>{portfolioName ?? messages.title}</h1>
      <p>{messages.description}</p>
    </header>
  );
}
